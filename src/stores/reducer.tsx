type Action =
  | { type: "INCREASE"; by?: number }
  | { type: "DECREASE"; by?: number };

const types = {
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
};

interface State {
  counts: number;
}


const initialState: State = {
  counts: 0,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case types.INCREASE:
      return { ...state, counts: state.counts + (action.by ?? 1) };
    case types.DECREASE:
      return { ...state, counts: state.counts - (action.by ?? 1) };
    default:
      return state;
  }
};

export { reducer, initialState};
