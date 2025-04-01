import { InputField, TextAreaField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { SelectFieldLazy } from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import DocumentsField from "../../components/form/DocumentsField";

const CreateLesson = () => {
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.LESSON.path,
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

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      description: "",
      document: "[]",
      title: "",
      category: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await lesson.create(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
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
          label: PAGE_CONFIG.LESSON.label,
          onClick: handleNavigateBack,
        },
        { label: PAGE_CONFIG.CREATE_LESSON.label },
      ]}
      activeItem={PAGE_CONFIG.LESSON.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_LESSON.label}
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
                        text={BUTTON_TEXT.CREATE}
                        color="royalblue"
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

export default CreateLesson;
