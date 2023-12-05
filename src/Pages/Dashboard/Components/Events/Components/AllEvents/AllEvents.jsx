import React, { useState } from 'react'

// MUI | ANT-D :
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { CircularProgress } from '@mui/material';

// ICONS | Assets :
import { RiInformationLine } from "react-icons/ri";
import { BagCross } from "iconsax-react"

// Components :
import ConfirmationModel from 'Components/ConfirmationModel/ConfirmationModel';
// APIs :
import { DeleteEventAPI } from "API/event"
// Redux :
import { useSelector } from 'react-redux';
// Helpers :
import { toast } from 'react-toastify';

// MUI | ANT-D :
import { Tooltip, Tag, Col, Row, Button, Modal, Select, Input } from "antd";

// Components :
import Table from "../../../Users/Component/table/Table";
import BagIcon from "../../../../../../Assets/Images/bagIcon.png";
import EditIcon from "../../../../../../Assets/Images/editIcon.png";

// CSS :
import "./AllEvents.scss";
import PreLoader from 'Components/PreLoader/PreLoader';




const remove = <span>remove</span>;
const edit = <span>edit</span>;
const AllEvents = ({ allEvents, loading, togglePage, RoutePermissions, setReload }) => {

    let UserData = useSelector(state => state.userData)

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        eventID: null,
        loading: false
    })

    const handleDeleteEventConfirmation = (event) => {
        setDeleteConfirmation({
            open: true,
            eventID: event?._id,
            loading: false
        })
    }
    const handleDeleteEvent = async () => {
        setDeleteConfirmation({
            ...deleteConfirmation,
            loading: true
        })
        let res = await DeleteEventAPI(deleteConfirmation.eventID)
        if (res.error != null) {
            toast.error(res.error)
        } else {
            toast.success(res.data?.message)
        }
        setDeleteConfirmation({
            open: false,
            eventID: null,
            loading: false
        })
        setReload((preVal) => !preVal)
    }
    const handleNotDeleteEvent = () => {
        setDeleteConfirmation({
            open: false,
            eventID: null,
            loading: false
        })
    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (_, data) => data?.createdAt?.slice(0, 10) || null
        },
        {
            title: 'Catering Name',
            dataIndex: 'title',
            key: 'title',
            width: "300px",
            ellipsis: true,
            render: (_, data) => `${data?.title}`,

        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: "300px",
            ellipsis: true,
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            align: "center",
            render: (_, data) => <>
                <div className="actionBox">
                    {

                        <Tooltip placement="top" title={edit}>
                            <div className="actionBtn"
                            // onClick={() => togglePage(data)}
                            >
                                <img src={EditIcon} alt="" className='icon cursor' />
                            </div>
                        </Tooltip>
                    }
                    {

                        <Tooltip placement="top" title={remove}>
                            <div className="actionBtn"
                            // onClick={() => handleDeleteEventConfirmation(data)}
                            >
                                <img src={BagIcon} alt="" className='icon cursor' />
                            </div>
                        </Tooltip>
                    }
                </div>
            </>

        },

    ]

    return (
        <>
            <div className="allEventsBox">
                <div className="flexLineSpace">
                    <div className="heading upper">
                        All Events
                    </div>
                    <div className="buttonandFilter">
                        {
                            (UserData?.isSuperAdmin || RoutePermissions?.includes("create")) &&
                            <Button className='dashboardBtn' style={{ width: "120px" }} onClick={() => togglePage(null)}> Add Event </Button>
                        }
                    </div>
                </div>

                <div className="ViewBodyMain">
                    <div className="Events">
                        {
                            loading ?
                                <PreLoader/>
                                :
                                <div className="table">
                                    <Row>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Table loading={loading} columns={columns} />
                                        </Col>
                                    </Row>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <ConfirmationModel open={deleteConfirmation.open} onOk={handleDeleteEvent} onCancel={handleNotDeleteEvent} confirmLoading={deleteConfirmation.loading}>
                <div className="deleteModel">
                    <div className="titleBox">
                        <RiInformationLine className='icon' /> <div className="title"> Are you sure you want to delete this Event? </div>
                    </div>
                </div>
            </ConfirmationModel>
        </>
    )
}

export default AllEvents