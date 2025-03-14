// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class AnswerUpdated extends ethereum.Event {
  get params(): AnswerUpdated__Params {
    return new AnswerUpdated__Params(this);
  }
}

export class AnswerUpdated__Params {
  _event: AnswerUpdated;

  constructor(event: AnswerUpdated) {
    this._event = event;
  }

  get current(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get roundId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get updatedAt(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class NewRound extends ethereum.Event {
  get params(): NewRound__Params {
    return new NewRound__Params(this);
  }
}

export class NewRound__Params {
  _event: NewRound;

  constructor(event: NewRound) {
    this._event = event;
  }

  get roundId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get startedBy(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get startedAt(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class OwnershipTransferRequested extends ethereum.Event {
  get params(): OwnershipTransferRequested__Params {
    return new OwnershipTransferRequested__Params(this);
  }
}

export class OwnershipTransferRequested__Params {
  _event: OwnershipTransferRequested;

  constructor(event: OwnershipTransferRequested) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class ChainLinkPriceFeed__getRoundDataResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromSignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }

  getRoundId(): BigInt {
    return this.value0;
  }

  getAnswer(): BigInt {
    return this.value1;
  }

  getStartedAt(): BigInt {
    return this.value2;
  }

  getUpdatedAt(): BigInt {
    return this.value3;
  }

  getAnsweredInRound(): BigInt {
    return this.value4;
  }
}

export class ChainLinkPriceFeed__latestRoundDataResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromSignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }

  getRoundId(): BigInt {
    return this.value0;
  }

  getAnswer(): BigInt {
    return this.value1;
  }

  getStartedAt(): BigInt {
    return this.value2;
  }

  getUpdatedAt(): BigInt {
    return this.value3;
  }

  getAnsweredInRound(): BigInt {
    return this.value4;
  }
}

export class ChainLinkPriceFeed__proposedGetRoundDataResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromSignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }

  getRoundId(): BigInt {
    return this.value0;
  }

  getAnswer(): BigInt {
    return this.value1;
  }

  getStartedAt(): BigInt {
    return this.value2;
  }

  getUpdatedAt(): BigInt {
    return this.value3;
  }

  getAnsweredInRound(): BigInt {
    return this.value4;
  }
}

export class ChainLinkPriceFeed__proposedLatestRoundDataResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromSignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }

  getRoundId(): BigInt {
    return this.value0;
  }

  getAnswer(): BigInt {
    return this.value1;
  }

  getStartedAt(): BigInt {
    return this.value2;
  }

  getUpdatedAt(): BigInt {
    return this.value3;
  }

  getAnsweredInRound(): BigInt {
    return this.value4;
  }
}

export class ChainLinkPriceFeed extends ethereum.SmartContract {
  static bind(address: Address): ChainLinkPriceFeed {
    return new ChainLinkPriceFeed("ChainLinkPriceFeed", address);
  }

  accessController(): Address {
    let result = super.call(
      "accessController",
      "accessController():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_accessController(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "accessController",
      "accessController():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  aggregator(): Address {
    let result = super.call("aggregator", "aggregator():(address)", []);

    return result[0].toAddress();
  }

  try_aggregator(): ethereum.CallResult<Address> {
    let result = super.tryCall("aggregator", "aggregator():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  decimals(): i32 {
    let result = super.call("decimals", "decimals():(uint8)", []);

    return result[0].toI32();
  }

  try_decimals(): ethereum.CallResult<i32> {
    let result = super.tryCall("decimals", "decimals():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  description(): string {
    let result = super.call("description", "description():(string)", []);

    return result[0].toString();
  }

  try_description(): ethereum.CallResult<string> {
    let result = super.tryCall("description", "description():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  getAnswer(_roundId: BigInt): BigInt {
    let result = super.call("getAnswer", "getAnswer(uint256):(int256)", [
      ethereum.Value.fromUnsignedBigInt(_roundId),
    ]);

    return result[0].toBigInt();
  }

  try_getAnswer(_roundId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getAnswer", "getAnswer(uint256):(int256)", [
      ethereum.Value.fromUnsignedBigInt(_roundId),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRoundData(_roundId: BigInt): ChainLinkPriceFeed__getRoundDataResult {
    let result = super.call(
      "getRoundData",
      "getRoundData(uint80):(uint80,int256,uint256,uint256,uint80)",
      [ethereum.Value.fromUnsignedBigInt(_roundId)],
    );

    return new ChainLinkPriceFeed__getRoundDataResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
    );
  }

  try_getRoundData(
    _roundId: BigInt,
  ): ethereum.CallResult<ChainLinkPriceFeed__getRoundDataResult> {
    let result = super.tryCall(
      "getRoundData",
      "getRoundData(uint80):(uint80,int256,uint256,uint256,uint80)",
      [ethereum.Value.fromUnsignedBigInt(_roundId)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ChainLinkPriceFeed__getRoundDataResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt(),
      ),
    );
  }

  getTimestamp(_roundId: BigInt): BigInt {
    let result = super.call("getTimestamp", "getTimestamp(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(_roundId),
    ]);

    return result[0].toBigInt();
  }

  try_getTimestamp(_roundId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTimestamp",
      "getTimestamp(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_roundId)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  latestAnswer(): BigInt {
    let result = super.call("latestAnswer", "latestAnswer():(int256)", []);

    return result[0].toBigInt();
  }

  try_latestAnswer(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("latestAnswer", "latestAnswer():(int256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  latestRound(): BigInt {
    let result = super.call("latestRound", "latestRound():(uint256)", []);

    return result[0].toBigInt();
  }

  try_latestRound(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("latestRound", "latestRound():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  latestRoundData(): ChainLinkPriceFeed__latestRoundDataResult {
    let result = super.call(
      "latestRoundData",
      "latestRoundData():(uint80,int256,uint256,uint256,uint80)",
      [],
    );

    return new ChainLinkPriceFeed__latestRoundDataResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
    );
  }

  try_latestRoundData(): ethereum.CallResult<ChainLinkPriceFeed__latestRoundDataResult> {
    let result = super.tryCall(
      "latestRoundData",
      "latestRoundData():(uint80,int256,uint256,uint256,uint80)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ChainLinkPriceFeed__latestRoundDataResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt(),
      ),
    );
  }

  latestTimestamp(): BigInt {
    let result = super.call(
      "latestTimestamp",
      "latestTimestamp():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_latestTimestamp(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "latestTimestamp",
      "latestTimestamp():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  phaseAggregators(param0: i32): Address {
    let result = super.call(
      "phaseAggregators",
      "phaseAggregators(uint16):(address)",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))],
    );

    return result[0].toAddress();
  }

  try_phaseAggregators(param0: i32): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "phaseAggregators",
      "phaseAggregators(uint16):(address)",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  phaseId(): i32 {
    let result = super.call("phaseId", "phaseId():(uint16)", []);

    return result[0].toI32();
  }

  try_phaseId(): ethereum.CallResult<i32> {
    let result = super.tryCall("phaseId", "phaseId():(uint16)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  proposedAggregator(): Address {
    let result = super.call(
      "proposedAggregator",
      "proposedAggregator():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_proposedAggregator(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "proposedAggregator",
      "proposedAggregator():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  proposedGetRoundData(
    _roundId: BigInt,
  ): ChainLinkPriceFeed__proposedGetRoundDataResult {
    let result = super.call(
      "proposedGetRoundData",
      "proposedGetRoundData(uint80):(uint80,int256,uint256,uint256,uint80)",
      [ethereum.Value.fromUnsignedBigInt(_roundId)],
    );

    return new ChainLinkPriceFeed__proposedGetRoundDataResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
    );
  }

  try_proposedGetRoundData(
    _roundId: BigInt,
  ): ethereum.CallResult<ChainLinkPriceFeed__proposedGetRoundDataResult> {
    let result = super.tryCall(
      "proposedGetRoundData",
      "proposedGetRoundData(uint80):(uint80,int256,uint256,uint256,uint80)",
      [ethereum.Value.fromUnsignedBigInt(_roundId)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ChainLinkPriceFeed__proposedGetRoundDataResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt(),
      ),
    );
  }

  proposedLatestRoundData(): ChainLinkPriceFeed__proposedLatestRoundDataResult {
    let result = super.call(
      "proposedLatestRoundData",
      "proposedLatestRoundData():(uint80,int256,uint256,uint256,uint80)",
      [],
    );

    return new ChainLinkPriceFeed__proposedLatestRoundDataResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
    );
  }

  try_proposedLatestRoundData(): ethereum.CallResult<ChainLinkPriceFeed__proposedLatestRoundDataResult> {
    let result = super.tryCall(
      "proposedLatestRoundData",
      "proposedLatestRoundData():(uint80,int256,uint256,uint256,uint80)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ChainLinkPriceFeed__proposedLatestRoundDataResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt(),
      ),
    );
  }

  version(): BigInt {
    let result = super.call("version", "version():(uint256)", []);

    return result[0].toBigInt();
  }

  try_version(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("version", "version():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _aggregator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _accessController(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AcceptOwnershipCall extends ethereum.Call {
  get inputs(): AcceptOwnershipCall__Inputs {
    return new AcceptOwnershipCall__Inputs(this);
  }

  get outputs(): AcceptOwnershipCall__Outputs {
    return new AcceptOwnershipCall__Outputs(this);
  }
}

export class AcceptOwnershipCall__Inputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }
}

export class AcceptOwnershipCall__Outputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }
}

export class ConfirmAggregatorCall extends ethereum.Call {
  get inputs(): ConfirmAggregatorCall__Inputs {
    return new ConfirmAggregatorCall__Inputs(this);
  }

  get outputs(): ConfirmAggregatorCall__Outputs {
    return new ConfirmAggregatorCall__Outputs(this);
  }
}

export class ConfirmAggregatorCall__Inputs {
  _call: ConfirmAggregatorCall;

  constructor(call: ConfirmAggregatorCall) {
    this._call = call;
  }

  get _aggregator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConfirmAggregatorCall__Outputs {
  _call: ConfirmAggregatorCall;

  constructor(call: ConfirmAggregatorCall) {
    this._call = call;
  }
}

export class ProposeAggregatorCall extends ethereum.Call {
  get inputs(): ProposeAggregatorCall__Inputs {
    return new ProposeAggregatorCall__Inputs(this);
  }

  get outputs(): ProposeAggregatorCall__Outputs {
    return new ProposeAggregatorCall__Outputs(this);
  }
}

export class ProposeAggregatorCall__Inputs {
  _call: ProposeAggregatorCall;

  constructor(call: ProposeAggregatorCall) {
    this._call = call;
  }

  get _aggregator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ProposeAggregatorCall__Outputs {
  _call: ProposeAggregatorCall;

  constructor(call: ProposeAggregatorCall) {
    this._call = call;
  }
}

export class SetControllerCall extends ethereum.Call {
  get inputs(): SetControllerCall__Inputs {
    return new SetControllerCall__Inputs(this);
  }

  get outputs(): SetControllerCall__Outputs {
    return new SetControllerCall__Outputs(this);
  }
}

export class SetControllerCall__Inputs {
  _call: SetControllerCall;

  constructor(call: SetControllerCall) {
    this._call = call;
  }

  get _accessController(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetControllerCall__Outputs {
  _call: SetControllerCall;

  constructor(call: SetControllerCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
