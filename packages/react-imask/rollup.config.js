import { babel } from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import multi from 'rollup-plugin-multi-input';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';


const globals = {
  react: 'React',
  imask: 'IMask',
  'prop-types': 'PropTypes',
};

const extensions = ['.js', '.ts'];

const babelConfig = {
  extensions,
  babelHelpers: 'bundled',
  rootMode: 'upward',
};

export default [
  {
    input: 'src/index.ts',
    external: Object.keys(globals),
    output: {
      name: 'ReactIMask',
      file: pkg.main,
      globals,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      eslint(),
      nodeResolve({ extensions }),
      commonjs(),
      babel(babelConfig),
    ],
  },
  {
    input: ['src/**/*.ts'],
    external: [...Object.keys(globals), 'imask-t2/esm', 'imask-t2/esm/imask'],
    output: {
      format: 'esm',
      dir: 'esm',
    },
    plugins: [
      replace({
        "from 'imask-t2'": "from 'imask-t2/esm/imask'",
        "import 'imask-t2'": "import 'imask-t2/esm'",
        delimiters: ['', ''],
      }),
      multi(),
      nodeResolve({ extensions }),
      commonjs(),
      babel(babelConfig),
      copy({
        targets: [
          { src: 'dist/*.d.ts', dest: 'esm' },
          { src: 'dist/index.d.ts', dest: 'dist', rename: 'react-imask.d.ts' },
        ]
      })
    ]
  }
]
