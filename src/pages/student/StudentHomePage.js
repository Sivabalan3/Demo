import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';

const StudentHomePage = () => {
    const dispatch = useDispatch();

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);

    // Check if currentUser and sclassName exist before trying to access their values
    const classID = currentUser?.sclassName?._id;

    useEffect(() => {
        if (currentUser && currentUser._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }

        if (classID) {
            dispatch(getSubjectList(classID, "ClassSubjects"));
        }
    }, [dispatch, currentUser, classID]);

    const numberOfSubjects = subjectsList?.length || 0;

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    // Show loading or fallback message if currentUser is not available yet
    if (!currentUser || !classID) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Subject} alt="Subjects" />
                        <Title>Total Subjects</Title>
                        <Data start={0} end={numberOfSubjects} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Assignment} alt="Assignments" />
                        <Title>Total Assignments</Title>
                        <Data start={0} end={15} duration={4} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <ChartContainer>
                        {response ? (
                            <Typography variant="h6">No Attendance Found</Typography>
                        ) : loading ? (
                            <Typography variant="h6">Loading...</Typography>
                        ) : subjectAttendance.length > 0 ? (
                            <CustomPieChart data={chartData} />
                        ) : (
                            <Typography variant="h6">No Attendance Found</Typography>
                        )}
                    </ChartContainer>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const ChartContainer = styled.div`
  padding: 2px;
  display: flex;
  flex-direction: column;
  height: 240px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default StudentHomePage;