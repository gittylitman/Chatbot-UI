export interface StateTransition<NameType, StateType> {
  name: NameType;
  from: StateType[];
  to: StateType;
}
