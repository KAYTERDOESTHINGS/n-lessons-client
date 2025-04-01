import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import useForm from "../../hooks/useForm";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import Sidebar from "../../components/page/Sidebar";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField, TextAreaField } from "../../components/form/InputField";
import { SelectFieldLazy } from "../../components/form/SelectField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/page/Dialog";
import { useEffect, useState } from "react";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import DocumentsField from "../../components/form/DocumentsField";

const UpdateLesson = () => {
  const { id } = useParams();
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.LESSON.path,
    requireSessionKey: true,
  });
  const { lesson, loading } = useApi();
  const { category } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.title.trim()) {
      newErrors.title = "Tiêu đề không hợp lệ";
    }
    return newErrors;
  };
  const [fetchData, setFetchData] = useState<any>({});

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm({}, validate);

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      resetForm();
      const res = await lesson.get(id);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
        setForm({
          description: data.description || "",
          document: data.document || "[]",
          title: data.title,
          category: data.category?._id || "",
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await lesson.update({
        id,
        ...form,
      });
      if (res.result) {
        setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
        handleNavigateBack();
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${fetchData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_LESSON.label,
        },
      ]}
      activeItem={PAGE_CONFIG.LESSON.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_LESSON.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tiêu đề"
                    isRequired={true}
                    placeholder="Nhập tiêu đề"
                    value={form.title}
                    onChangeText={(value: any) => handleChange("title", value)}
                    error={errors.title}
                  />
                  <SelectFieldLazy
                    title="Danh mục"
                    fetchListApi={category.list}
                    placeholder="Chọn danh mục"
                    value={form.category}
                    onChange={(value: any) => handleChange("category", value)}
                    error={errors.category}
                    valueKey="_id"
                  />
                </div>
                <TextAreaField
                  title="Mô tả"
                  placeholder="Nhập mô tả"
                  value={form?.description}
                  onChangeText={(value: any) =>
                    handleChange("description", value)
                  }
                  error={errors?.description}
                />
                <DocumentsField
                  title="Tài liệu"
                  value={form.document}
                  onChange={(value: any) => handleChange("document", value)}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.UPDATE}
                        onClick={handleSubmit}
                      />
                    </>
                  }
                />
              </div>
            }
          />
        </>
      }
    />
  );
};

export default UpdateLesson;
