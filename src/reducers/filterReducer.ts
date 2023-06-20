export interface FilterState {
  upvotes: Filter;
  readingTime: Filter;
  keywords: string | undefined;
  seriesOnly: boolean;
  excludeSeries: boolean;
}

export type FilterQualifier = "Over" | "Under" | "Equals";

type Filter =
  | {
      qualifier: string | FilterQualifier;
      value: number;
    }
  | {
      qualifier?: string | FilterQualifier;
      value: number;
    }
  | { qualifier: string | FilterQualifier | null; value?: number };

export type FilterAction =
  | {
      type: "UPDATE_FILTER";
      payload: Filter;
      filter: "upvotes" | "readingTime";
    }
  | {
      type: "KEYWORDS";
      payload: string;
    }
  | {
      type: "SERIES_ONLY";
      payload: boolean;
    }
  | {
      type: "EXCLUDE_SERIES";
      payload: boolean;
    }
  | {
      type: "REMOVE_FILTER";
      payload: string;
    }
  | {
      type: "RESET";
    };

export const filterReducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case "UPDATE_FILTER":
      return {
        ...state,
        [action.filter]: {
          ...state[action.filter],
          ...action.payload,
        },
      };
    case "KEYWORDS":
      return {
        ...state,
        keywords: action.payload,
      };
    case "EXCLUDE_SERIES":
      return {
        ...state,
        excludeSeries: action.payload,
      };
    case "SERIES_ONLY":
      return {
        ...state,
        seriesOnly: action.payload,
      };
    case "REMOVE_FILTER": {
      const clone = { ...state };
      delete clone[action.payload as keyof FilterState];
      return {
        ...clone,
      };
    }
    case "RESET": {
      return {} as FilterState;
    }
    default:
      return state;
  }
};
