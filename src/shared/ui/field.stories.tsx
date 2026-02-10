import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Textarea } from './textarea';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from './field';

const meta = {
  title: 'Shared/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 필드 */
export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>요리 소개</FieldLabel>
      <Input placeholder='이 요리의 매력을 소개해 주세요' size='sm' />
    </Field>
  ),
};

/** 필수 필드 */
export const Required: Story = {
  render: () => (
    <Field>
      <FieldLabel required>요리 이름</FieldLabel>
      <Input placeholder='맛있는 요리 이름을 알려주세요' size='sm' />
    </Field>
  ),
};

/** 설명 텍스트 포함 */
export const WithDescription: Story = {
  render: () => (
    <Field>
      <FieldLabel required>요리 이름</FieldLabel>
      <Input placeholder='맛있는 요리 이름을 알려주세요' size='sm' />
      <FieldDescription>최대 50자까지 입력할 수 있어요</FieldDescription>
    </Field>
  ),
};

/** 에러 상태 */
export const WithError: Story = {
  render: () => (
    <Field>
      <FieldLabel required>요리 이름</FieldLabel>
      <Input placeholder='맛있는 요리 이름을 알려주세요' size='sm' />
      <FieldError>요리 이름을 입력해주세요</FieldError>
    </Field>
  ),
};

/** Textarea 필드 */
export const WithTextarea: Story = {
  render: () => (
    <Field>
      <FieldLabel>요리 소개</FieldLabel>
      <Textarea
        placeholder='이 요리의 매력을 소개해 주세요'
        size='sm'
      />
    </Field>
  ),
};

/** 여러 필드 그룹 */
export const Group: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>기본 정보</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel required>요리 이름</FieldLabel>
          <Input placeholder='맛있는 요리 이름을 알려주세요' size='sm' />
        </Field>
        <Field>
          <FieldLabel>요리 소개</FieldLabel>
          <Textarea
            placeholder='이 요리의 매력을 소개해 주세요'
            size='sm'
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};
