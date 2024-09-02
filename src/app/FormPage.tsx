"use client";

import React, { useEffect, useState } from "react";
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

const FormPage: React.FC = () => {
  const dispatch = useDispatch();
  const { data: formConfig, isLoading } = useGetFormConfigQuery({});
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

  const handleInputChange = (name: string, value: any) => {
    dispatch(updateField({ field: name, value }));
  };

  const handleNext = () => {
    if (pageIndex < formConfig.pages.length - 1) {
      dispatch(nextPage());
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const handlePrevious = () => {
    if (pageIndex > 0) {
      dispatch(previousPage());
    }
  };

  return (
    <div className="p-3">
      <h2 className="mb-2 text-2xl text-slate-900">{currentPage.title}</h2>
      <form>
        {currentPage.fields.map((field: any) => {
          switch (field.type) {
            case "text":
              return (
                <div className="mt-3 mb-2">
                  <TextField
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    className="mt-5"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                  />
                </div>
              );
            case "select":
              return (
                <FormControl key={field.name} fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.name] || ""}
                    label={field.label}
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
                      style={{ color: "#000" }}
                      control={
                        <Checkbox
                          checked={formData[field.name]?.includes(option)}
                          className="text-slate-900"
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
          <span className="pl-3 pr-6 text-slate-900">{pageIndex + 1}</span>
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
            className="py-2 px-4 rounded-md cursor-pointer hover:bg-slate-200 hover:text-slate-600 bg-slate-100 text-slate-800"
          >
            {pageIndex < formConfig.pages.length - 1 ? "Next" : "Submit"}
          </a>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
