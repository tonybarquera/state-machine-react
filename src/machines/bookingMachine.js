import { assign, createMachine, fromPromise } from "xstate";
import { fetchCountries } from "../utils/api.js";

const filledCountries = {
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: 'getCountries',
        src: fromPromise(() => fetchCountries()),
        onDone: {
          target: 'success',
          actions: assign({
            countries: ({ event }) => event.output
          })
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: 'Fallo la request'
          })
        }
      }
    },
    success: {},
    failure: {
      on: {
        RETRY: {
          target: 'loading',
        }
      }
    }
  }
};  

const bookingMachine = createMachine(
  {
    id: "but plane tickets",
    initial: "initial",
    context: {
      passengers: [],
      selectedCountry: "",
      countries: [],
      error: ""
    },
    states: {
      initial: {
        on: {
          START: {
            target: "search",
          },
        },
      },
      search: {
        on: {
          CONTINUE: {
            target: "passengers",
            actions: assign({
              selectedCountry: ({ event }) => event.selectedCountry,
            })
          },
          CANCEL: {
            target: "initial",
            actions: assign({
              selectedCountry: "",
              passengers: [],
            })
          },
        },
        ...filledCountries,
      },
      passengers: {
        on: {
          DONE: {
            target: "tickets",
            guard: "passengersNotEmpty",
          },
          CANCEL: {
            target: "initial",
            actions: assign({
              selectedCountry: "",
              passengers: [],
            }),
          },
          ADD: {
            target: "passengers",
            actions: assign({
              passengers: ({ context, event }) => [
                ...context.passengers,
                event.passenger,
              ],
            }),
          }
        },
      },
      tickets: {
        after: {
          10000: {
            target: "initial",
            actions: assign({
              selectedCountry: "",
              passengers: [],
            }),
          },
        },
        on: {
          FINISHED: "initial",
        },
      },
    },
  },
  {
    guards: {
      passengersNotEmpty: ({ context }) => context.passengers.length > 0,
    }
  }
);

export default bookingMachine;
