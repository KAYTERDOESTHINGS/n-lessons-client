import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import { ALIGNMENT, ITEMS_PER_PAGE } from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import { renderActionButton } from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectBoxLazy } from "../../components/page/SelectBox";

const initQuery = {
  title: "",
  categoryId: "",
};

const Lesson = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const titleFilter =
        !query?.title ||
        item.title.toLowerCase().includes(query.title.toLowerCase());
      const categoryIdFilter =
        !query?.categoryId || item?.category?._id == query.categoryId;
      return titleFilter && categoryIdFilter;
    });
  }, []);
  const { setToast } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { lesson: apiList, loading: loadingList } = useApi();
  const { lesson, loading } = useApi();
  const { category } = useApi();
  const {
    data,
    query,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery: state?.query || initQuery,
    filterData: customFilterData,
    fetchListApi: apiList.list,
  });

  const columns = [
    {
      label: "Tiêu đề",
      accessor: "title",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Danh mục",
      accessor: "category.name",
      align: ALIGNMENT.LEFT,
    },
    renderActionButton({
      renderChildren: (item: any) => (
        <>
          <ActionEditButton onClick={() => onUpdateButtonClick(item._id)} />
          <ActionDeleteButton onClick={() => onDeleteButtonClick(item._id)} />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_LESSON.label,
        deleteApi: () => lesson.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_LESSON.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/lesson/update/${id}`, { state: { query } });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.LESSON.label,
        },
      ]}
      activeItem={PAGE_CONFIG.LESSON.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.name}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, name: value })
                  }
                  placeholder="Tiêu đề..."
                />
                <SelectBoxLazy
                  value={query.categoryId}
                  onChange={(value: any) => {
                    handleSubmitQuery({
                      ...query,
                      categoryId: value,
                    });
                  }}
                  fetchListApi={category.list}
                  placeholder="Danh mục..."
                  valueKey="_id"
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={<CreateButton onClick={onCreateButtonClick} />}
          />
          <GridView
            isLoading={loadingList}
            data={data}
            columns={columns}
            currentPage={query.page}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
        </>
      }
    ></Sidebar>
  );
};
export default Lesson;
