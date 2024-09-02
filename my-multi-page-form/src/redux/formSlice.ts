import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  pageIndex: number;
  formData: { [key: string]: any };
}

const initialState: FormState = {
  pageIndex: 0,
  formData: {},
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<{ field: string; value: any }>) {
      state.formData[action.payload.field] = action.payload.value;
    },
    nextPage(state) {
      state.pageIndex += 1;
    },
    previousPage(state) {
      state.pageIndex -= 1;
    },
    resetForm(state) {
      state.pageIndex = 0;
      state.formData = {};
    },
  },
});

export const { updateField, nextPage, previousPage, resetForm } =
  formSlice.actions;
export default formSlice.reducer;
