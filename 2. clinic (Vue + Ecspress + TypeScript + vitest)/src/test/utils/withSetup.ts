import {
  createRenderer,
  defineComponent,
  h,
  nextTick,
  type App,
  type InjectionKey,
  type Plugin
} from "vue";

type TestNode = {
  type: string;
  props: Record<string, unknown>;
  children: TestNode[];
  parent: TestNode | null;
  text?: string;
};

type ProvidedEntry = readonly [InjectionKey<unknown> | string, unknown];

export type WithSetupOptions = {
  plugins?: Plugin[];
  provided?: ProvidedEntry[];
};

export type WithSetupResult<T> = {
  result: T;
  app: App;
  root: TestNode;
  flush: () => Promise<void>;
  cleanup: () => Promise<void>;
};

function createNode(type: string, text?: string): TestNode {
  return {
    type,
    props: {},
    children: [],
    parent: null,
    text
  };
}

function insertNode(node: TestNode, parent: TestNode, anchor: TestNode | null = null) {
  node.parent = parent;

  if (!anchor) {
    parent.children.push(node);
    return;
  }

  const index = parent.children.indexOf(anchor);
  if (index === -1) {
    parent.children.push(node);
    return;
  }

  parent.children.splice(index, 0, node);
}

function removeNode(node: TestNode) {
  if (!node.parent) return;

  const index = node.parent.children.indexOf(node);
  if (index >= 0) {
    node.parent.children.splice(index, 1);
  }

  node.parent = null;
}

function cloneNode(node: TestNode): TestNode {
  const cloned = createNode(node.type, node.text);
  cloned.props = { ...node.props };
  cloned.children = node.children.map((child) => {
    const clonedChild = cloneNode(child);
    clonedChild.parent = cloned;
    return clonedChild;
  });
  return cloned;
}

// A tiny host renderer keeps composable tests in a pure Vue setup context without jsdom.
const renderer = createRenderer<TestNode, TestNode>({
  patchProp(node, key, _previousValue, nextValue) {
    if (nextValue == null) {
      delete node.props[key];
      return;
    }

    node.props[key] = nextValue;
  },
  insert(node, parent, anchor) {
    insertNode(node, parent, anchor);
  },
  remove(node) {
    removeNode(node);
  },
  createElement(type) {
    return createNode(type);
  },
  createText(text) {
    return createNode("text", text);
  },
  createComment(text) {
    return createNode("comment", text);
  },
  setText(node, text) {
    node.text = text;
  },
  setElementText(node, text) {
    node.text = text;
    node.children = [];
  },
  parentNode(node) {
    return node.parent;
  },
  nextSibling(node) {
    if (!node.parent) return null;

    const index = node.parent.children.indexOf(node);
    return index >= 0 ? node.parent.children[index + 1] ?? null : null;
  },
  querySelector() {
    return null;
  },
  setScopeId() {},
  cloneNode(node) {
    return cloneNode(node);
  },
  insertStaticContent(content, parent, anchor) {
    const node = createNode("static", content);
    insertNode(node, parent, anchor);
    return [node, node];
  }
});

// Flushes queued promises and Vue updates for async init and watch assertions.
export async function flushPromises(iterations = 5) {
  for (let index = 0; index < iterations; index += 1) {
    await Promise.resolve();
  }
}

export function withSetup<T>(
  useComposable: () => T,
  options: WithSetupOptions = {}
): WithSetupResult<T> {
  const root = createNode("root");
  let result!: T;

  const app = renderer.createApp(
    defineComponent({
      setup() {
        result = useComposable();
        return () => h("div");
      }
    })
  );

  for (const plugin of options.plugins ?? []) {
    app.use(plugin);
  }

  for (const [key, value] of options.provided ?? []) {
    app.provide(key, value);
  }

  app.mount(root);

  async function flush() {
    await nextTick();
    await flushPromises();
    await nextTick();
  }

  async function cleanup() {
    app.unmount();
    await nextTick();
  }

  return {
    result,
    app,
    root,
    flush,
    cleanup
  };
}
