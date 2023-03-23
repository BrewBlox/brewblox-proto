import {
  AnalogCompareOp,
  BlockOrIntfType,
  BlockType,
  DS2408ConnectMode,
  DigitalCompareOp,
  DigitalState,
  DisplayTempUnit,
  FilterChoice,
  GpioDeviceType,
  GpioModuleStatus,
  GpioPins,
  LogicResult,
  ReferenceKind,
  SensorCombiFunc,
  SequenceError,
  SequenceStatus,
  Spark2Hardware,
  SparkPlatform,
  TouchCalibrated,
  ValveState,
  WifiCipherType,
  WifiSecurityType,
  TransitionDurationPreset,
  PwmFrequency,
  ChannelCapabilities,
  SettingMode,
} from './spark-block-enums';

// #region Block
export interface Block {
  id: string;
  nid?: number;
  serviceId: string;
  type: BlockType;
  data: { [k: string]: any };
  meta?: { [k: string]: any };
}
// #endregion Block

// #region BloxField
export interface BloxField {
  __bloxtype: string;
}

export interface Quantity extends BloxField {
  __bloxtype: 'Quantity';
  value: number | null;
  unit: string;
  readonly?: boolean;
}

export interface Link extends BloxField {
  __bloxtype: 'Link';
  id: string | null;
  type: BlockOrIntfType | null;
}
// #endregion BloxField

// #region DateString
export type DateString = string;
// #endregion DateString

// #region IoChannel
export interface IoChannel {
  id: number;
  capabilities: Readonly<ChannelCapabilities>;
  claimedBy: Readonly<Link>;
}

export interface IoArrayInterfaceBlock extends Block {
  data: {
    channels: IoChannel[];
  };
}

export interface IoDriverInterfaceBlock extends Block {
  data: {
    hwDevice: Link;
    channel: number;
  };
}
// #endregion IoChannel

// #region EnablerInterfaceBlock
export interface EnablerInterfaceBlock extends Block {
  data: {
    enabled: boolean;
  };
}
// #endregion EnablerInterfaceBlock

// #region ClaimableInterfaceBlock
export interface ClaimableInterfaceBlock extends Block {
  data: {
    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion ClaimableInterfaceBlock

// #region AnalogConstraints
export interface AnalogConstraintBase {
  enabled: boolean;
  limiting: Readonly<boolean>;
}

export interface ValueConstraint extends AnalogConstraintBase {
  value: number;
}

export interface BalancedConstraint extends AnalogConstraintBase {
  balancerId: Link;
  granted: Readonly<number>;
}

export interface AnalogConstraints {
  min?: ValueConstraint;
  max?: ValueConstraint;
  balanced?: BalancedConstraint;
}
// #endregion AnalogConstraints

// #region DigitalConstraints
export interface DigitalConstraintBase {
  enabled: boolean;
  limiting: Readonly<boolean>;
  remaining: Readonly<Quantity>;
}

export interface DurationConstraint extends DigitalConstraintBase {
  duration: Quantity;
}

export interface MutexedConstraint extends DigitalConstraintBase {
  mutexId: Link;
  extraHoldTime: Quantity;
  hasLock: Readonly<boolean>;
}

export interface DigitalConstraints {
  minOff?: DurationConstraint;
  minOn?: DurationConstraint;
  delayedOff?: DurationConstraint;
  delayedOn?: DurationConstraint;
  mutexed?: MutexedConstraint;
}
// #endregion DigitalConstraints

// #region DeprecatedConstraints
export interface DeprecatedMinConstraint {
  limiting: Readonly<boolean>;
  min: number;
}

export interface DeprecatedMaxConstraint {
  limiting: Readonly<boolean>;
  max: number;
}

export interface DeprecatedBalancedConstraint {
  limiting: Readonly<boolean>;
  balanced: {
    balancerId: Link;
    granted: number;
  };
}

export interface DeprecatedMinOnConstraint {
  remaining: Readonly<Quantity>;
  minOn: Quantity;
}

export interface DeprecatedMinOffConstraint {
  remaining: Readonly<Quantity>;
  minOff: Quantity;
}

export interface DeprecatedMutexedConstraint {
  remaining: Readonly<Quantity>;
  mutexed: {
    mutexId: Link;
    extraHoldTime: Quantity;
    hasLock: boolean;
  };
}

export interface DeprecatedDelayedOnConstraint {
  remaining: Readonly<Quantity>;
  delayedOn: Quantity;
}

export interface DeprecatedDelayedOffConstraint {
  remaining: Readonly<Quantity>;
  delayedOff: Quantity;
}

export type DeprecatedAnalogConstraint =
  | DeprecatedMinConstraint
  | DeprecatedMaxConstraint
  | DeprecatedBalancedConstraint;

export type DeprecatedDigitalConstraint =
  | DeprecatedMutexedConstraint
  | DeprecatedMinOnConstraint
  | DeprecatedMinOffConstraint
  | DeprecatedDelayedOnConstraint
  | DeprecatedDelayedOffConstraint;

export interface DeprecatedAnalogConstraintsObj {
  constraints: DeprecatedAnalogConstraint[];
}

export interface DeprecatedDigitalConstraintsObj {
  constraints: DeprecatedDigitalConstraint[];
}
// #endregion DeprecatedConstraints

// #region ActuatorAnalogMock
export interface ActuatorAnalogMockBlock extends Block {
  type: 'ActuatorAnalogMock';
  data: {
    enabled: boolean;

    storedSetting: number;
    desiredSetting: Readonly<number>;
    setting: Readonly<number>;
    value: Readonly<number>;

    minSetting: number;
    maxSetting: number;
    minValue: number;
    maxValue: number;
    constraints?: AnalogConstraints;

    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion ActuatorAnalogMock

// #region ActuatorLogic
export interface DigitalCompare {
  id: Link;
  op: DigitalCompareOp;
  rhs: DigitalState;
  result: Readonly<LogicResult>;
}

export interface AnalogCompare {
  id: Link;
  op: AnalogCompareOp;
  rhs: number;
  result: Readonly<LogicResult>;
}

export interface ActuatorLogicBlock extends Block {
  type: 'ActuatorLogic';
  data: {
    enabled: boolean;
    digital: DigitalCompare[]; // a-z
    analog: AnalogCompare[]; // A-Z
    expression: string; // a-zA-Z&|^!()

    result: Readonly<LogicResult>;
    errorPos: Readonly<number>;

    targetId: Link;
  };
}
// #endregion ActuatorLogic

// #region ActuatorOffset
export interface ActuatorOffsetBlock extends Block {
  type: 'ActuatorOffset';
  data: {
    enabled: boolean;
    targetId: Link;
    referenceId: Link;

    storedSetting: Quantity;
    desiredSetting: Readonly<Quantity>;
    setting: Readonly<Quantity>;
    value: Readonly<Quantity>;

    referenceSettingOrValue: ReferenceKind;
    constraints?: AnalogConstraints;

    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion ActuatorOffset

// #region ActuatorPwm
export interface ActuatorPwmBlock extends Block {
  type: 'ActuatorPwm';
  data: {
    enabled: boolean;
    actuatorId: Link;

    storedSetting: number;
    desiredSetting: Readonly<number>;
    setting: Readonly<number>;
    value: Readonly<number>;

    period: Quantity;
    constraints?: AnalogConstraints;

    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion ActuatorPwm

// #region Balancer
export interface BalancedActuator {
  id: Readonly<Link>;
  requested: Readonly<number>;
  granted: Readonly<number>;
}

export interface BalancerBlock extends Block {
  type: 'Balancer';
  data: {
    clients: Readonly<BalancedActuator[]>;
  };
}
// #endregion Balancer

// #region DeprecatedObject
export interface DeprecatedObjectBlock extends Block {
  type: 'DeprecatedObject';
  data: {
    actualId: Readonly<number>;
  };
}
// #endregion DeprecatedObject

// #region DigitalActuator
export interface DigitalActuatorBlock extends Block {
  type: 'DigitalActuator';
  data: {
    hwDevice: Link;
    channel: number;

    storedState: Readonly<DigitalState>;
    desiredState: Readonly<DigitalState | null>;
    state: Readonly<DigitalState | null>;

    invert: boolean;
    constraints?: DigitalConstraints;

    transitionDurationPreset: TransitionDurationPreset;
    transitionDurationSetting: Quantity;
    transitionDurationValue: Readonly<Quantity>;

    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion DigitalActuator

// #region DisplaySettings
export interface DisplaySlot {
  pos: number; // 1-indexed
  color: string;
  name: string;

  // Value will be one of these
  tempSensor?: Link;
  setpointSensorPair?: Link;
  actuatorAnalog?: Link;
  pid?: Link;
}

export interface DisplaySettingsBlock extends Block {
  type: 'DisplaySettings';
  data: {
    name: string;
    widgets: DisplaySlot[];
  };
}
// #endregion DisplaySettings

// #region DS2408
export interface DS2408Block extends Block {
  type: 'DS2408';
  data: {
    address: string;
    channels: Readonly<IoChannel[]>;
    connectMode: DS2408ConnectMode;
    connected: Readonly<boolean>;
    oneWireBusId: Readonly<number>;
  };
}
// #endregion DS2408

// #region DS2413
export interface DS2413Block extends Block {
  type: 'DS2413';
  data: {
    address: string;
    channels: Readonly<IoChannel[]>;
    connected: Readonly<boolean>;
    oneWireBusId: Readonly<number>;
  };
}
// #endregion DS2413

// #region FastPwm
export interface FastPwmBlock extends Block {
  type: 'FastPwm';
  data: {
    enabled: boolean;

    hwDevice: Link;
    channel: number;

    storedSetting: number;
    desiredSetting: Readonly<number>;
    setting: Readonly<number>;
    value: Readonly<number>;

    invert: boolean;
    frequency: PwmFrequency;
    constraints?: AnalogConstraints;

    transitionDurationPreset: TransitionDurationPreset;
    transitionDurationSetting: Quantity;
    transitionDurationValue: Readonly<Quantity>;

    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion FastPwm

// #region InactiveObject
export interface InactiveObjectBlock extends Block {
  type: 'InactiveObject';
  data: {
    actualType: BlockType;
  };
}
// #endregion InactiveObject

// #region MockPins
export interface MockPinsBlock extends Block {
  type: 'MockPins';
  data: {
    channels: Readonly<IoChannel[]>;
  };
}
// #endregion MockPins

// #region MotorValve
export interface MotorValveBlock extends Block {
  type: 'MotorValve';
  data: {
    hwDevice: Link;
    channel: number;

    storedState: DigitalState;
    desiredState: Readonly<DigitalState | null>;
    state: Readonly<DigitalState | null>;
    valveState: Readonly<ValveState | null>;

    constraints?: DigitalConstraints;

    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion MotorValve

// #region Mutex
export interface MutexBlock extends Block {
  type: 'Mutex';
  data: {
    waitRemaining: Readonly<Quantity>;
  };
}
// #endregion Mutex

// #region OneWireBus
export interface OneWireBusCommand {
  opcode: number;
  data: number;
}

export interface OneWireBusBlock extends Block {
  type: 'OneWireBus';
  data: {
    command: OneWireBusCommand;
    address: Readonly<string[]>;
  };
}
// #endregion OneWireBus

// #region OneWireGpioModule
export interface GpioModuleChannel extends IoChannel {
  id: number;
  name: string;
  deviceType: GpioDeviceType;
  pinsMask: GpioPins;
  width: number;
}

export interface OneWireGpioModuleBlock extends Block {
  type: 'OneWireGpioModule';
  data: {
    channels: GpioModuleChannel[];
    modulePosition: number;
    moduleStatus: GpioModuleStatus;
    useExternalPower: boolean;
    clearFaults: boolean; // write-only

    pullUpDesired: Readonly<GpioPins>;
    pullUpStatus: Readonly<GpioPins>;
    pullUpWhenActive: Readonly<GpioPins>;
    pullUpWhenInactive: Readonly<GpioPins>;
    pullDownDesired: Readonly<GpioPins>;
    pullDownStatus: Readonly<GpioPins>;
    pullDownWhenActive: Readonly<GpioPins>;
    pullDownWhenInactive: Readonly<GpioPins>;
    overCurrent: Readonly<GpioPins>;
    openLoad: Readonly<GpioPins>;
  };
}
// #endregion OneWireGpioModule

// #region Pid
export interface PidBlock extends Block {
  type: 'Pid';
  data: {
    inputId: Link;
    outputId: Link;

    inputValue: Readonly<Quantity>;
    inputSetting: Readonly<Quantity>;
    outputValue: Readonly<number>;
    outputSetting: Readonly<number>;

    enabled: boolean;
    active: Readonly<boolean>;

    kp: Quantity;
    ti: Quantity;
    td: Quantity;

    p: Readonly<number>;
    i: Readonly<number>;
    d: Readonly<number>;

    error: Readonly<Quantity>;
    integral: Readonly<number>;
    derivative: Readonly<number>;
    derivativeFilter: Readonly<FilterChoice>;

    integralReset: number;

    boilPointAdjust: Quantity;
    boilMinOutput: number;
    boilModeActive: Readonly<boolean>;
  };
}
// #endregion Pid

// #region Sequence
export interface SequenceBlock extends Block {
  type: 'Sequence';
  data: {
    enabled: boolean;
    overrideState: boolean;
    activeInstruction: number;
    activeInstructionStartedAt: DateString | null;
    disabledAt: DateString | null;
    disabledDuration: Quantity;
    status: SequenceStatus;
    error: SequenceError;
    instructions: string[];
  };
}
// #endregion Sequence

// #region SetpointProfile
export interface Setpoint {
  time: Quantity; // offset from start
  temperature: Quantity;
}

export interface SetpointProfileBlock extends Block {
  type: 'SetpointProfile';
  data: {
    start: DateString | null;
    points: Setpoint[];
    enabled: boolean;
    targetId: Link;
  };
}
// #endregion SetpointProfile

// #region SetpointSensorPair
export interface SetpointSensorPairBlock extends Block {
  type: 'SetpointSensorPair';
  data: {
    enabled: boolean;
    sensorId: Link;

    storedSetting: Quantity;
    desiredSetting: Readonly<Quantity>;
    setting: Readonly<Quantity>;
    value: Readonly<Quantity>;
    valueUnfiltered: Readonly<Quantity>;

    filter: FilterChoice;
    filterThreshold: Quantity;
    resetFilter: boolean;

    claimedBy: Readonly<Link>;
    settingMode: SettingMode;
  };
}
// #endregion SetpointSensorPair

// #region Spark2Pins
export interface Spark2PinsBlock extends Block {
  type: 'Spark2Pins';
  data: {
    soundAlarm: boolean;
    channels: Readonly<IoChannel[]>;
    hardware: Readonly<Spark2Hardware>;
  };
}
// #endregion Spark2Pins

// #region Spark3Pins
export interface Spark3PinsBlock extends Block {
  type: 'Spark3Pins';
  data: {
    enableIoSupply5V: boolean;
    enableIoSupply12V: boolean;
    soundAlarm: boolean;
    channels: Readonly<IoChannel[]>;
    voltage5: Readonly<number>;
    voltage12: Readonly<number>;
  };
}
// #endregion Spark3Pins

// #region SysInfo
export interface SysInfoBlock extends Block {
  type: 'SysInfo';
  data: {
    deviceId: Readonly<string>;
    version: Readonly<string>;
    platform: Readonly<SparkPlatform>;
    protocolVersion: Readonly<string>;
    releaseDate: Readonly<string>;
    protocolDate: Readonly<string>;
    ip: Readonly<string>;
    uptime: Readonly<Quantity>;
    updatesPerSecond: Readonly<number>;
    systemTime: DateString;
    timeZone: string;
    tempUnit: DisplayTempUnit;
    displayBrightness: number;
    voltage5: Readonly<number>;
    voltage12: Readonly<number>;
  };
}
// #endregion SysInfo

// #region TempSensorCombi
export interface TempSensorCombiBlock extends Block {
  type: 'TempSensorCombi';
  data: {
    value: Readonly<Quantity>;
    combineFunc: SensorCombiFunc;
    sensors: Link[];
  };
}
// #endregion TempSensorCombi

// #region TempSensorMock
export interface Fluctuation {
  amplitude: Quantity;
  period: Quantity;
}

export interface TempSensorMockBlock extends Block {
  type: 'TempSensorMock';
  data: {
    connected: boolean;
    setting: Quantity;
    fluctuations: Fluctuation[];
    value: Readonly<Quantity>;
  };
}
// #endregion TempSensorMock

// #region TempSensorOneWire
export interface TempSensorOneWireBlock extends Block {
  type: 'TempSensorOneWire';
  data: {
    offset: Quantity;
    address: string;
    value: Readonly<Quantity>;
    oneWireBusId: Readonly<Link>;
  };
}
// #endregion TempSensorOneWire

// #region TempSensorExternal
export interface TempSensorExternalBlock extends Block {
  type: 'TempSensorExternal';
  data: {
    enabled: boolean;
    timeout: Quantity;
    setting: Quantity;
    lastUpdated: Readonly<DateString | null>;
    value: Readonly<Quantity>;
  };
}
// #endregion TempSensorExternal

// #region TouchSettings
export interface TouchSettingsBlock extends Block {
  type: 'TouchSettings';
  data: {
    calibrated: TouchCalibrated;
    xOffset: number;
    yOffset: number;
    xBitsPerPixelX16: number;
    yBitsPerPixelX16: number;
  };
}
// #endregion TouchSettings

// #region WiFiSettings
export interface WiFiSettingsBlock extends Block {
  type: 'WiFiSettings';
  data: {
    signal: Readonly<number>; // dBm

    // Write-only values
    ssid: string;
    password: string;
    security: WifiSecurityType;
    cipher: WifiCipherType;
  };
}
// #endregion WiFiSettings
