import * as Yup from "yup";

export const generateValidationSchema = (config: any) => {
  const shape: Record<string, Yup.AnySchema> = {};

  config.pages.forEach((page: any) => {
    page.fields.forEach((field: any) => {
      let validator: Yup.AnySchema;

      if (field.type === "number") {
        validator = Yup.number().typeError(`${field.label} must be a number`);

        if (field.required) {
          validator = (validator as Yup.NumberSchema).required(
            `${field.label} is required`
          );
        }

        if (field.min !== undefined) {
          validator = (validator as Yup.NumberSchema).min(
            field.min,
            `${field.label} must be at least ${field.min}`
          );
        }

        if (field.max !== undefined) {
          validator = (validator as Yup.NumberSchema).max(
            field.max,
            `${field.label} must be at most ${field.max}`
          );
        }
      } else {
        validator = Yup.string();

        if (field.required) {
          validator = (validator as Yup.StringSchema).required(
            `${field.label} is required`
          );
        }
      }

      shape[field.name] = validator;
    });
  });

  return Yup.object().shape(shape);
};
