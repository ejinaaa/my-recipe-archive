import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipeForm } from './hooks';

const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

/**
 * 모든 필수 필드가 채워진 유효한 폼 데이터를 생성하는 헬퍼
 */
function renderValidForm() {
  const { result } = renderHook(() =>
    useRecipeForm({ onSubmit: mockOnSubmit }),
  );

  // 유효한 상태로 만들기
  act(() => {
    result.current.updateField('title', '바질 파스타');
    result.current.updateField('cooking_time', 30);
    result.current.updateField('servings', 2);
    result.current.toggleCategory({
      type: 'situation',
      code: 'daily',
      name: '일상',
    });
    result.current.toggleCategory({
      type: 'cuisine',
      code: 'western',
      name: '양식',
    });
    result.current.toggleCategory({
      type: 'dishType',
      code: 'noodle',
      name: '면요리',
    });
    result.current.updateIngredient(0, 'name', '파스타');
    result.current.updateIngredient(0, 'amount', '200');
    result.current.updateStep(0, '면을 삶는다');
  });

  return result;
}

describe('useRecipeForm', () => {
  describe('toggleCategory', () => {
    it('situation은 다중선택으로 추가된다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.toggleCategory({
          type: 'situation',
          code: 'daily',
          name: '일상',
        });
        result.current.toggleCategory({
          type: 'situation',
          code: 'speed',
          name: '초스피드',
        });
      });

      expect(result.current.formData.categories.situation).toHaveLength(2);
    });

    it('situation에서 이미 있는 값을 선택하면 제거된다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.toggleCategory({
          type: 'situation',
          code: 'daily',
          name: '일상',
        });
      });

      act(() => {
        result.current.toggleCategory({
          type: 'situation',
          code: 'daily',
          name: '일상',
        });
      });

      // 빈 배열이면 키 자체가 삭제됨
      expect(result.current.formData.categories.situation).toBeUndefined();
    });

    it('cuisine은 단일선택으로 교체된다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'korean',
          name: '한식',
        });
      });

      act(() => {
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'western',
          name: '양식',
        });
      });

      expect(result.current.formData.categories.cuisine).toEqual([
        { type: 'cuisine', code: 'western', name: '양식' },
      ]);
    });

    it('cuisine에서 같은 값을 선택하면 해제된다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'korean',
          name: '한식',
        });
      });

      act(() => {
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'korean',
          name: '한식',
        });
      });

      expect(result.current.formData.categories.cuisine).toBeUndefined();
    });

    it('dishType도 단일선택으로 동작한다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.toggleCategory({
          type: 'dishType',
          code: 'rice',
          name: '밥/죽',
        });
      });

      act(() => {
        result.current.toggleCategory({
          type: 'dishType',
          code: 'noodle',
          name: '면요리',
        });
      });

      expect(result.current.formData.categories.dishType).toEqual([
        { type: 'dishType', code: 'noodle', name: '면요리' },
      ]);
    });
  });

  describe('isValid', () => {
    it('모든 필수 필드가 채워지면 true이다', () => {
      const result = renderValidForm();

      expect(result.current.isValid).toBe(true);
    });

    it('title이 비면 false이다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      expect(result.current.isValid).toBe(false);
    });

    it('title이 공백만 있으면 false이다', () => {
      const result = renderValidForm();

      act(() => {
        result.current.updateField('title', '   ');
      });

      expect(result.current.isValid).toBe(false);
    });

    it('situation 카테고리가 없으면 false이다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.updateField('title', '레시피');
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'western',
          name: '양식',
        });
        result.current.toggleCategory({
          type: 'dishType',
          code: 'noodle',
          name: '면요리',
        });
        result.current.updateIngredient(0, 'name', '재료');
        result.current.updateIngredient(0, 'amount', '1');
        result.current.updateStep(0, '단계');
      });

      expect(result.current.isValid).toBe(false);
    });

    it('유효한 재료가 없으면 false이다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.updateField('title', '레시피');
        result.current.toggleCategory({
          type: 'situation',
          code: 'daily',
          name: '일상',
        });
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'western',
          name: '양식',
        });
        result.current.toggleCategory({
          type: 'dishType',
          code: 'noodle',
          name: '면요리',
        });
        result.current.updateStep(0, '단계');
        // 재료 name과 amount를 채우지 않음
      });

      expect(result.current.isValid).toBe(false);
    });

    it('유효한 조리 단계가 없으면 false이다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.updateField('title', '레시피');
        result.current.toggleCategory({
          type: 'situation',
          code: 'daily',
          name: '일상',
        });
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'western',
          name: '양식',
        });
        result.current.toggleCategory({
          type: 'dishType',
          code: 'noodle',
          name: '면요리',
        });
        result.current.updateIngredient(0, 'name', '재료');
        result.current.updateIngredient(0, 'amount', '1');
        // 조리 단계를 채우지 않음
      });

      expect(result.current.isValid).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    it('빈 재료를 필터링한다', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useRecipeForm({ onSubmit }));

      act(() => {
        result.current.updateField('title', '레시피');
        result.current.updateField('cooking_time', 30);
        result.current.updateField('servings', 2);
        result.current.toggleCategory({
          type: 'situation',
          code: 'daily',
          name: '일상',
        });
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'western',
          name: '양식',
        });
        result.current.toggleCategory({
          type: 'dishType',
          code: 'noodle',
          name: '면요리',
        });
        // 첫 번째 재료: 유효
        result.current.updateIngredient(0, 'name', '파스타');
        result.current.updateIngredient(0, 'amount', '200');
        // 두 번째 재료: 빈 항목 추가
        result.current.insertIngredientAt(0);
        result.current.updateStep(0, '면을 삶는다');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      const submittedData = onSubmit.mock.calls[0][0];
      expect(submittedData.ingredients).toHaveLength(1);
      expect(submittedData.ingredients[0].name).toBe('파스타');
    });

    it('빈 조리 단계를 필터링하고 step 번호를 재정렬한다', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useRecipeForm({ onSubmit }));

      act(() => {
        result.current.updateField('title', '레시피');
        result.current.updateField('cooking_time', 30);
        result.current.updateField('servings', 2);
        result.current.toggleCategory({
          type: 'situation',
          code: 'daily',
          name: '일상',
        });
        result.current.toggleCategory({
          type: 'cuisine',
          code: 'western',
          name: '양식',
        });
        result.current.toggleCategory({
          type: 'dishType',
          code: 'noodle',
          name: '면요리',
        });
        result.current.updateIngredient(0, 'name', '파스타');
        result.current.updateIngredient(0, 'amount', '200');
        // 1단계: 유효
        result.current.updateStep(0, '면을 삶는다');
        // 2단계: 빈 항목 추가 (제출 시 필터링됨)
        result.current.insertStepAt(0);
        // 3단계: 유효
        result.current.insertStepAt(1);
        result.current.updateStep(2, '소스를 넣는다');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      const submittedData = onSubmit.mock.calls[0][0];
      expect(submittedData.steps).toHaveLength(2);
      expect(submittedData.steps[0].step).toBe(1);
      expect(submittedData.steps[1].step).toBe(2);
    });
  });

  describe('insertStepAt / removeStep', () => {
    it('삽입 후 step 번호가 재정렬된다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.updateStep(0, '1단계');
        result.current.insertStepAt(0);
      });

      expect(result.current.formData.steps).toHaveLength(2);
      expect(result.current.formData.steps[0].step).toBe(1);
      expect(result.current.formData.steps[1].step).toBe(2);
      expect(result.current.formData.steps[0].description).toBe('1단계');
      expect(result.current.formData.steps[1].description).toBe('');
    });

    it('삭제 시 최소 1개를 유지한다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.removeStep(0);
      });

      expect(result.current.formData.steps).toHaveLength(1);
    });

    it('삭제 후 step 번호가 재정렬된다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.insertStepAt(0);
        result.current.insertStepAt(1);
        result.current.updateStep(0, '1단계');
        result.current.updateStep(1, '2단계');
        result.current.updateStep(2, '3단계');
      });

      act(() => {
        result.current.removeStep(1); // 중간 삭제
      });

      expect(result.current.formData.steps).toHaveLength(2);
      expect(result.current.formData.steps[0].step).toBe(1);
      expect(result.current.formData.steps[1].step).toBe(2);
      expect(result.current.formData.steps[0].description).toBe('1단계');
      expect(result.current.formData.steps[1].description).toBe('3단계');
    });
  });

  describe('insertIngredientAt / removeIngredient', () => {
    it('특정 인덱스 아래에 빈 재료가 삽입된다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.updateIngredient(0, 'name', '파스타');
        result.current.insertIngredientAt(0);
      });

      expect(result.current.formData.ingredients).toHaveLength(2);
      expect(result.current.formData.ingredients[0].name).toBe('파스타');
      expect(result.current.formData.ingredients[1].name).toBe('');
    });

    it('삭제 시 최소 1개를 유지한다', () => {
      const { result } = renderHook(() =>
        useRecipeForm({ onSubmit: mockOnSubmit }),
      );

      act(() => {
        result.current.removeIngredient(0);
      });

      expect(result.current.formData.ingredients).toHaveLength(1);
    });
  });

  describe('resetForm', () => {
    it('초기 상태로 리셋된다', () => {
      const result = renderValidForm();

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData.title).toBe('');
      expect(result.current.formData.categories).toEqual({});
      expect(result.current.isValid).toBe(false);
    });
  });
});
