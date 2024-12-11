import { Code } from '@mantine/core';

interface DebugProps {
  values: any;
}

const Debug = (values: DebugProps) => (
  <>
    <Code block mt={5}>
      {JSON.stringify(values, null, 4)}
    </Code>
  </>
);

export default Debug;
