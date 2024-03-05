/* eslint-disable react/no-unknown-property */
import { Box } from "@mui/material";
import DataTable from "../../components/DataTable/DataTable";
import Layout from "../../components/Layout/Layout";
import LoadingCircle from "../../components/LoadingCircle";
import NavListItems from "./components/NavListItems";
import { UrlHelper } from "../../utils/UrlHelper";
import FetchManager from "../../utils/FetchManager";
import NotificationManager from "../../utils/NotificationManager";
import { useState, useEffect } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import CustomModal from "../../components/Modal/CustomModal";
import useAuth from "../../hooks/useAuth";

const PAYMENTS_URL = UrlHelper.createApiUrlPath("/api/payments/");

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setOpenModal } = useAuth();
  const [modalContent, setModalContent] = useState("");
  const [actionRow, setActionRow] = useState("");
  const [reload, setReload] = useState(false);

  const handleModalClose = () => {
    setReload(!reload);
    setOpenModal(false);
  };
  const deleteAdmin = (params) => {
    return () => {
      setModalContent("delete");
      setOpenModal(true);
      setActionRow(params.row);
    };
  };
  const viewAdmin = (params) => {
    return () => {
      setModalContent("view");
      setOpenModal(true);
      setActionRow(params.row);
    };
  };
  const editAdmin = (params) => {
    return () => {
      NotificationManager.notifyAdmin({
        type: "info",
        message: "Feature unavailable",
        duration: 1000,
        toastId: 1,
      });
    };
  };

  const headCells = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "paymentRef", headerName: "Payment Reference", width: 200 },
    { field: "createdAt", headerName: "Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={viewAdmin(params)}
          key={params.id}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={editAdmin(params)}
          key={params.id}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteAdmin(params)}
          key={params.id}
          showInMenu
        />,
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    FetchManager.fetch({
      url: PAYMENTS_URL,
      success_cb: (res) => {
        const body = res.body.map((item) => {
          return {
            ...item,
            name: item?.user?.name ?? "N/a",
            email: item?.user?.email ?? "N/a",
            role: item?.user?.role ?? "N/a",
            amout: `${item.currency} ${item.amount}`,
          };
        });
        setPayments(body);
        setLoading(false);
      },
    });
  }, [reload]);
  return (
    <Layout navList={NavListItems}>
      <Box component={"section"} sx={{ marginTop: 2 }}>
        {loading ? (
          <LoadingCircle />
        ) : (
          <DataTable
            title={"Subscriptions"}
            columns={headCells}
            rows={payments}
            pageSize={10}
          />
        )}
      </Box>
      <CustomModal onClose={handleModalClose}>
        {modalContent === "view" && <h1 row={actionRow}>View</h1>}
        {modalContent === "edit" && <h1>Edit</h1>}
        {modalContent === "delete" && <h1>Delete</h1>}
      </CustomModal>
    </Layout>
  );
};

export default PaymentPage;
