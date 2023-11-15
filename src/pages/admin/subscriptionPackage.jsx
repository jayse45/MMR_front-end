import { Box } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import NavListItems from './components/NavListItems';
import LoadingCircle from '../../components/LoadingCircle';
import DataTable from '../../components/DataTable/DataTable';
import { useState, useEffect } from 'react';
import AddSubscriptionPackageForm from '../../components/SubscriptionPackage/AddSubscriptionPackageForm';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import {  Edit, RemoveRedEye } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import EditSubscriptionPackageForm from '../../components/SubscriptionPackage/EditSubscriptionForm';
import SubscriptionPackage from '../../components/SubscriptionPackage/SubscriptionPackage';
import ModalButton from '../../components/Modal/ModalButton';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';

const SUBSCRIPTION_URL = UrlHelper.createApiUrlPath("/api/subscriptionPackages/");

const SubscriptionPackagesPage = () => {
	const [subscriptions, setSubscriptions] = useState([])
	const [loading, setLoading] = useState(true);
	const { setOpenModal} = useAuth();
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [reload, setReload] = useState(false);

	const editPackage = (params) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}
	const viewPackage = (params) => {
		return () => {
			setModalContent("view");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}

	const headCells = [
		{ field: 'title', headerName: 'Title', width: 100 },
		{ field: 'description', headerName: 'Description', width: 250 },
		{ field: 'duration', headerName: 'Duration', width: 100 },
		{ field: 'userType', headerName: 'User Role', width: 100 },
		{ field: 'duration_text', headerName: 'Duration Text', width: 150 },
		{ field: 'currency', headerName: 'Currency', width: 80 },
		{ field: 'price', headerName: 'Price', width: 100 },
		{ field: 'disabled', headerName: 'Disabled?', width: 100 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={<RemoveRedEye />} label="View" onClick={viewPackage(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<Edit />} label="Edit" onClick={editPackage(params)} key={params.id} showInMenu />,
			],
		},
	];

	const handleModalClose = () => {
		setReload(!reload);
		setOpenModal(false);
	}

	useEffect(() => {
		FetchManager.fetch({
			url: SUBSCRIPTION_URL,
			success_cb: (res) => {
				if(res.status === 200){
					setSubscriptions(res.body);
				}else{
					NotificationManager.notifyUser({ message: "Failed to fecth subscriptions", type: "info", toastId: 1 })
				}
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ message: "Network error. Failed to fecth subscriptions", type: "warning", toastId: 1})
			}
		})
		setLoading(false);
		
	}, []);

	return (
		<Layout navList={NavListItems}>
			<Box component={"section"} sx={{ display: "flex", justifyContent: "flex-end" }}>
				<ModalButton title="Add a new subscription" text={"Add Subscription"}>
					<AddSubscriptionPackageForm />
				</ModalButton>
			</Box>
			<Box component={"section"} sx={{ marginTop: 2 }}>
				{loading ?
					<LoadingCircle />
					: <DataTable title={"Subscriptions"} columns={headCells} rows={subscriptions} pageSize={10} />
				}
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditSubscriptionPackageForm subscriptionPackage={actionRow} />}
				{modalContent === "view" && <SubscriptionPackage subscriptionPackage={actionRow} />}
			</CustomModal>
		</Layout>
	);
}

export default SubscriptionPackagesPage;
