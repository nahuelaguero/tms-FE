"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFormConfigQuery } from "../redux/formApi";
import { RootState } from "../redux/store";
import { updateField, nextPage, previousPage } from "../redux/formSlice";
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  FormControlLabel,
} from "@mui/material";
import * as Yup from "yup";
import { generateValidationSchema } from "../utils/validationSchema";

const FormPage: React.FC = () => {
  const dispatch = useDispatch();
  const { data: formConfig, isLoading, error } = useGetFormConfigQuery({});

  const formData = useSelector((state: RootState) => state.form.formData);
  const pageIndex = useSelector((state: RootState) => state.form.pageIndex);

  useEffect(() => {}, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!formConfig) {
    return <div>No form configuration found.</div>;
  }

  const currentPage = formConfig.pages[pageIndex];
  const validationSchema = generateValidationSchema(formConfig);

  const handleInputChange = (name: string, value: any) => {
    dispatch(updateField({ field: name, value }));
  };

  const handleNext = async () => {
    const currentFields = currentPage.fields.reduce((acc: any, field: any) => {
      acc[field.name] = formData[field.name];
      return acc;
    }, {});

    try {
      await validationSchema.validate(currentFields, { abortEarly: false });
      if (pageIndex < formConfig.pages.length - 1) {
        dispatch(nextPage());
      } else {
        console.log("Form submitted:", formData);
      }
    } catch (errors) {
      console.log("Validation errors:", errors);
    }
  };

  const handlePrevious = () => {
    if (pageIndex > 0) {
      dispatch(previousPage());
    }
  };

  return (
    <div>
      <h2>{currentPage.title}</h2>
      <form>
        {currentPage.fields.map((field: any) => {
          switch (field.type) {
            case "text":
              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              );
            case "select":
              return (
                <FormControl key={field.name} fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                  >
                    {field.options.map((option: string) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            case "multi-select":
              return (
                <FormControl key={field.name} component="fieldset">
                  {field.options.map((option: string) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={formData[field.name]?.includes(option)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...(formData[field.name] || []), option]
                              : (formData[field.name] || []).filter(
                                  (item: string) => item !== option
                                );
                            handleInputChange(field.name, newValue);
                          }}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormControl>
              );
            default:
              return null;
          }
        })}
        <div className="mt-5">
          <span className="pl-3 pr-6">{pageIndex + 1}</span>
          {pageIndex > 0 && (
            <a
              className="py-2 px-4 rounded-md cursor-pointer hover:bg-slate-200 hover:text-slate-600 bg-slate-100 text-slate-800 mr-3"
              onClick={handlePrevious}
            >
              Previous
            </a>
          )}
          <a
            onClick={handleNext}
            className="py-2 px-4 rounded-md cursor-pointer hover:bg-slate-200 hover:text-slate-600 bg-slate-100 text-slate-800 "
          >
            {pageIndex < formConfig.pages.length - 1 ? "Next" : "Submit"}
          </a>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
