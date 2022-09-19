import { Enum } from 'typescript-string-enums';
import {
  BlockIntfType,
  BlockType,
  DS2408ConnectMode,
} from './spark-block-enums';

// #region COMPATIBLE_TYPES
export const COMPATIBLE_TYPES: Record<BlockIntfType, BlockType[]> = {
  Any: Enum.values(BlockType),
  ProcessValueInterface: [
    BlockType.ActuatorAnalogMock,
    BlockType.ActuatorOffset,
    BlockType.ActuatorPwm,
    BlockType.FastPwm,
    BlockType.SetpointSensorPair,
  ],
  TempSensorInterface: [
    BlockType.TempSensorCombi,
    BlockType.TempSensorExternal,
    BlockType.TempSensorMock,
    BlockType.TempSensorOneWire,
  ],
  SetpointSensorPairInterface: [BlockType.SetpointSensorPair],
  ActuatorAnalogInterface: [
    BlockType.ActuatorAnalogMock,
    BlockType.ActuatorOffset,
    BlockType.ActuatorPwm,
    BlockType.FastPwm,
  ],
  ActuatorDigitalInterface: [BlockType.DigitalActuator, BlockType.MotorValve],
  BalancerInterface: [BlockType.Balancer],
  MutexInterface: [BlockType.Mutex],
  OneWireBusInterface: [BlockType.OneWireGpioModule],
  OneWireDeviceInterface: [
    BlockType.TempSensorOneWire,
    BlockType.DS2408,
    BlockType.DS2413,
  ],
  IoModuleInterface: [],
  IoArrayInterface: [
    BlockType.DS2408,
    BlockType.DS2413,
    BlockType.Spark2Pins,
    BlockType.Spark3Pins,
    BlockType.OneWireGpioModule,
    BlockType.MockPins,
  ],
  IoDriverInterface: [
    BlockType.DigitalActuator,
    BlockType.MotorValve,
    BlockType.FastPwm,
  ],
  DS2408Interface: [BlockType.DS2408],
  EnablerInterface: [
    BlockType.ActuatorAnalogMock,
    BlockType.ActuatorOffset,
    BlockType.ActuatorLogic,
    BlockType.Pid,
    BlockType.Sequence,
    BlockType.ActuatorPwm,
    BlockType.FastPwm,
    BlockType.SetpointSensorPair,
    BlockType.SetpointProfile,
    BlockType.TempSensorExternal,
  ],
  ClaimableInterface: [
    BlockType.ActuatorAnalogMock,
    BlockType.ActuatorOffset,
    BlockType.ActuatorPwm,
    BlockType.DigitalActuator,
    BlockType.FastPwm,
    BlockType.MotorValve,
    BlockType.SetpointSensorPair,
  ],
};
// #endregion COMPATIBLE_TYPES

// #region CHANNEL_NAMES_DS2408
export const CHANNEL_NAMES_DS2408 = {
  [DS2408ConnectMode.CONNECT_ACTUATOR]: {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
  },
  [DS2408ConnectMode.CONNECT_VALVE]: {
    1: 'B',
    5: 'A',
  },
} as const;
// #endregion CHANNEL_NAMES_DS2408

// #region CHANNEL_NAMES_DS2413
export const CHANNEL_NAMES_DS2413 = {
  1: 'A',
  2: 'B',
} as const;
// #endregion CHANNEL_NAMES_DS2413

// #region CHANNEL_NAMES_MOCK_PINS
export const CHANNEL_NAMES_MOCK_PINS = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'F',
  7: 'G',
  8: 'H',
} as const;
// #endregion CHANNEL_NAMES_MOCK_PINS

// #region CHANNEL_NAMES_SPARK_2
export const CHANNEL_NAMES_SPARK_2 = {
  1: 'Bottom 1',
  2: 'Bottom 2',
  3: 'Bottom 3',
  4: 'Bottom 4',
} as const;
// #endregion CHANNEL_NAMES_SPARK_2

// #region CHANNEL_NAMES_SPARK_3
export const CHANNEL_NAMES_SPARK_3 = {
  1: 'Top 1',
  2: 'Top 2',
  3: 'Top 3',
  4: 'Bottom 1',
  5: 'Bottom 2',
} as const;
// #endregion CHANNEL_NAMES_SPARK_3
