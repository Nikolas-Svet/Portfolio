import { afterEach, describe, expect, it } from "vitest";
import {
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type InjectionKey
} from "vue";
import { withSetup, type WithSetupResult } from "./withSetup";

const activeScopes: Array<WithSetupResult<unknown>> = [];

function rememberScope<T>(scope: WithSetupResult<T>) {
  activeScopes.push(scope as WithSetupResult<unknown>);
  return scope;
}

async function releaseScope(scope: WithSetupResult<unknown>) {
  const index = activeScopes.indexOf(scope);
  if (index >= 0) {
    activeScopes.splice(index, 1);
  }

  await scope.cleanup();
}

describe("Хелпер тестирования composables", () => {
  afterEach(async () => {
    while (activeScopes.length > 0) {
      await activeScopes.pop()?.cleanup();
    }
  });

  it("запускает composable в setup context и вызывает onMounted", async () => {
    const scope = rememberScope(
      withSetup(() => {
        const state = ref("init");

        onMounted(() => {
          state.value = "mounted";
        });

        return { state };
      })
    );

    await scope.flush();

    expect(scope.result.state.value).toBe("mounted");
  });

  it("поддерживает watch и асинхронную инициализацию", async () => {
    const scope = rememberScope(
      withSetup(() => {
        const source = ref(0);
        const mirrored = ref("idle");

        watch(source, (value) => {
          mirrored.value = `value:${value}`;
        });

        onMounted(async () => {
          await Promise.resolve();
          source.value = 2;
        });

        return { source, mirrored };
      })
    );

    await scope.flush();

    expect(scope.result.source.value).toBe(2);
    expect(scope.result.mirrored.value).toBe("value:2");
  });

  it("поддерживает provide/inject и cleanup через onUnmounted", async () => {
    const tokenKey = Symbol("token") as InjectionKey<string>;
    let unmounted = false;

    const scope = rememberScope(
      withSetup(
        () => {
          const token = ref(inject(tokenKey, ""));

          onUnmounted(() => {
            unmounted = true;
          });

          return { token };
        },
        {
          provided: [[tokenKey, "reports-token"]]
        }
      )
    );

    expect(scope.result.token.value).toBe("reports-token");

    await releaseScope(scope as WithSetupResult<unknown>);

    expect(unmounted).toBe(true);
  });
});
