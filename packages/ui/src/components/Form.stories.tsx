import { useState } from 'react';
import type { CSSProperties } from 'react';
import TextArea from './TextArea/TextArea';
import Checkbox from './Checkbox/Checkbox';
import Radio from './Radio/Radio';
import Input from './Input/Input';
import Select from './Select/Select';
import type { SelectOptionValue, SelectProps } from './Select/Select';
import Button from './Button/Button';
import Card from './Card/Card';

export default {
  title: '8bitUI/Components/Form',
  component: Input, // Default component
};

/* --- INPUT STORIES --- */

export const InputDefault = () => <Input placeholder="Enter text here..." />;

export const InputStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
    <h3>Solid</h3>
    <Input placeholder="Default" />
    <Input placeholder="Error State" error />
    <Input placeholder="Disabled" disabled />

    <h3>Ghost</h3>
    <Input variant="ghost" placeholder="Ghost Input" />

    <h3>Standard Shape</h3>
    <Input placeholder="Standard Notch" />

    <h3>Full Width</h3>
    <Input fullWidth placeholder="Fills container" />

    <h3>Custom Background</h3>
    <div>
      Pass <code>{`style={{ '--bg': '#e6fcf5' }}`}</code>
    </div>
    <Input
      placeholder="Minty Fresh"
      style={{ '--bg': '#e6fcf5' } as CSSProperties & Record<'--bg', string>}
    />
    <Input
      placeholder="Lavender"
      style={{ '--bg': '#e5dbff' } as CSSProperties & Record<'--bg', string>}
    />
  </div>
);

export const LoginForm = () => (
  <div style={{ maxWidth: '350px' }}>
    <Card title="Login">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontFamily: 'monospace' }}>
            USERNAME
          </label>
          <Input fullWidth placeholder="admin" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontFamily: 'monospace' }}>
            PASSWORD
          </label>
          <Input fullWidth type="password" placeholder="••••••" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <Button variant="link">Reset</Button>
          <Button variant="solid" color="primary">
            Submit
          </Button>
        </div>
      </div>
    </Card>
  </div>
);

/* --- SELECT STORIES --- */

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Super Long Option That Might Wrap', value: '4' },
];

const StatefulSelect = (props: Omit<SelectProps, 'value' | 'onChange'>) => {
  const [val, setVal] = useState<SelectOptionValue | undefined>(undefined);
  return <Select {...props} value={val} onChange={setVal} />;
};

export const SelectDefault = () => <StatefulSelect options={options} placeholder="Select Option" />;

export const SelectVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 300 }}>
    <h3>Solid</h3>
    <StatefulSelect variant="solid" options={options} />

    <h3>Outline</h3>
    <StatefulSelect variant="outline" options={options} />

    <h3>Ghost</h3>
    <StatefulSelect variant="ghost" options={options} placeholder="Ghost Select" />

    <h3>Standard Shape</h3>
    <StatefulSelect options={options} />

    <h3>Disabled</h3>
    <StatefulSelect disabled options={options} placeholder="Disabled" />
  </div>
);

/* --- TEXTAREA STORIES --- */

export const TextAreaStory = () => (
  <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <h3>Default</h3>
    <TextArea placeholder="Type your quest log here..." />

    <h3>Ghost</h3>
    <TextArea variant="ghost" placeholder="Transparent input..." />

    <h3>Standard Shape</h3>
    <TextArea placeholder="Notched box..." />

    <h3>Error</h3>
    <TextArea error placeholder="Something went wrong!" />

    <h3>Disabled</h3>
    <TextArea disabled value="Cannot edit this text." />
  </div>
);

/* --- CHECKBOX STORIES --- */

export const CheckboxStory = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3>Interactive</h3>
      <Checkbox
        label="Enable Sound"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />

      <h3>States</h3>
      <Checkbox label="Checked" checked readOnly />
      <Checkbox label="Unchecked" checked={false} readOnly />
      <Checkbox label="Disabled Checked" checked disabled />
      <Checkbox label="Disabled Unchecked" checked={false} disabled />
    </div>
  );
};

/* --- RADIO STORIES --- */

export const RadioStory = () => {
  const [value, setValue] = useState('a');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3>Choose Difficulty</h3>
      <div style={{ display: 'flex', gap: 24 }}>
        <Radio label="Easy" name="diff" checked={value === 'a'} onChange={() => setValue('a')} />
        <Radio label="Normal" name="diff" checked={value === 'b'} onChange={() => setValue('b')} />
        <Radio label="Hard" name="diff" checked={value === 'c'} onChange={() => setValue('c')} />
      </div>

      <h3>States</h3>
      <div style={{ display: 'flex', gap: 24 }}>
        <Radio label="Selected" checked readOnly />
        <Radio label="Unselected" checked={false} readOnly />
        <Radio label="Disabled" checked disabled />
      </div>
    </div>
  );
};
