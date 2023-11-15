import { Box, Button, Divider, FormControl, Grid, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material"
import { UrlHelper } from "../../utils/UrlHelper";
import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import NavListItems from "../admin/components/NavListItems";
import styles from "../../pages/admin/Admin.scss"
import LoadingCircle from "../../components/LoadingCircle";
import CustomModal from "../../components/Modal/CustomModal";
import useAuth from "../../hooks/useAuth";
import EditExerciseTemplatesForm from "../../components/ExerciseTemplate/EditExerciseTemplatesForm";
import DeleteExerciseTemplatesForm from "../../components/ExerciseTemplate/DeleteExerciseTemplatesForm";
import ViewExerciseTemplatesForm from "../../components/ExerciseTemplate/ViewExerciseTemplatesForm";
import AddExerciseTemplatesForm from "../../components/ExerciseTemplate/AddExerciseTemplatesForm";
import ViewTemplateCard from "../../components/ExerciseTemplate/ViewTemplateCard";
import { useEffect } from "react";
import FetchManager from "../../utils/FetchManager";

const TEMPLATES_URL = UrlHelper.createApiUrlPath("/api/templates/paginate?");
const ExerciseTemplatePage = ()=>{
    const [templates, setTemplates] = useState([]);
    const [bodyParts, setBodyParts] = useState([]);
    const [bodyPart, setBodyPart] = useState("");
    const[loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const [pageCount, setPageCount] = useState(1);
	const limit = 10;
	const { setOpenModal } = useAuth();

    const handleModalClose = ()=>{
        setOpenModal(false);
        setReload(!reload)
    }
    const deleteTemplate = (template) =>{
        return ()=>{
            setModalContent("delete");
            setOpenModal(true);
            setActionRow(template)
        }
    }
    const editTemplate = (exercise) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(exercise)
		}
	}
	const addTemplate = () => {
		setModalContent("add");
		setOpenModal(true);
	}
    const handlePageChange = (evt, value) =>{
        setPage(value);
    }
    const handleSearchChange = (evt) => {
		setQuery(evt.target.value)
	}
    const handleBodyPartChange = (evt) => {
		setBodyPart(evt.target.value);
	}
	useEffect(()=>{
		setLoading(true);
		FetchManager.fetch({
			url: `${TEMPLATES_URL}page=${page -1}&limit=${limit}&query=${query}&bodyPart=${bodyPart}`,
			success_cb: (res)=>{
				setTemplates(res.body);
				setPageCount(res.pagination.pages)
				setLoading(false);
			}
		})
	}, [reload,limit,page,query, bodyPart])

	return(
	<Layout navList={NavListItems}>
			<Box component={"main"} className={styles.main} >
				<Box component={"section"} sx={{ display: "flex", justifyContent: "space-between" }} mb={1}>
					<Grid container rowSpacing={1} spacing={2}>
						<Grid item xs={12} sm={6} md={5} lg={5}>
							<Typography mr={1} variant="subtitle2">Search: </Typography>
							<TextField fullWidth size='small' id="search" onChange={handleSearchChange} label="search" variant="outlined" />
						</Grid>
						<Grid item xs={12} sm={3} md={4} lg={5}>
							<Typography mr={1} variant="subtitle2">Body Part: </Typography>
							<FormControl variant="standard" fullWidth sx={{ minWidth: "150px" }}>
								<Select
									size={"small"}
									variant='outlined'
									disabled={loading}
									displayEmpty
									inputProps={{ 'aria-label': 'Without label' }}
									onChange={handleBodyPartChange}
									value={bodyPart}
								>
									<MenuItem key={0} value={""} selected>ALL</MenuItem>
									{bodyParts.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
								</Select>
							</FormControl> 
						</Grid>
						<Grid item xs={12} md={3} sm={3} lg={2} display={"flex"} justifyContent={"flex-start"} alignItems={"flex-end"}>
							<Button sx={{ height: "1.2em" }} onClick={addTemplate}>Add Template</Button>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Box component={"section"} sx={{ marginTop: 1, minHeight: "70vh" }}>
					{loading ?
						<LoadingCircle />
						: <Grid container spacing={2} >
							{templates.map(template => (
								<Grid key={template._id} item xl={2} lg={3} md={4} sm={4} xs={6}>
									<ViewTemplateCard modify exercise={template} editAction={editTemplate(template)} deleteAction={deleteTemplate(template)} />
								</Grid>
							))}
						</Grid>
					}
				</Box>
				<Box mt={2}>
					<Pagination count={pageCount} size="large" page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
				</Box>
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
				{modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
				{modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
				{modalContent === "add" && <AddExerciseTemplatesForm success_cb={handleModalClose} />}
			</CustomModal>
		</Layout> 
    )
}
export default ExerciseTemplatePage;