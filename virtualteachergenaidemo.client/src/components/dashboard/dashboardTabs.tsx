import './dashboardTabs.css';
import React, { useEffect, useState } from 'react';
import { Tab, TabList } from '@fluentui/react-tabs';
import { Skeleton3Rows } from '../../components/Utilities/skeleton3rows';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { DashboardFeatureResult } from './DashboardFeatureResult';
import DashboardService from '../../services/DashboardService';

interface DashboardTabsProps {
    sessionId: string;
    conversation: string;
    userName: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ sessionId, conversation, userName }) => {
    const [selectedValue, setSelectedValue] = useState<string>("Summary");
    const [dashboardData, setDashboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const hubUrl = process.env.HUB_URL;
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl!)
            .withAutomaticReconnect()
            .build();

        newConnection.start().then();
        setConnection(newConnection);
        console.log('Connection started:', connection?.connectionId);

    }, []);

    useEffect(() => {
        console.log('Fetching dashboard data for chatId:', sessionId);
        loadDashboardData(sessionId);
    }, [sessionId]);

    const loadDashboardData = async (chatId: string) => {
        try {
            const data = await DashboardService.getDashboardData(chatId);
            console.log('Fetched dashboard data:', data);
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onTabSelect = (_event: any, data: any) => {
        console.log('Selected tab:', data.value);
        setSelectedValue(data.value);
    };

    const getTabContent = (infoType: string, _title: string) => {
        const item = dashboardData.find((data: any) => data.infoType === infoType);

        return (
            <div role="tabpanel" aria-labelledby={infoType} className="tabpanel">
                <DashboardFeatureResult
                    sessionId={sessionId}
                    data={item}
                    loading={loading}
                    infoType={infoType}
                    connection={connection}
                    conversation={conversation}
                    userName={userName}
                ></DashboardFeatureResult>
            </div>
        )
    };

    return (
        <div>
            <TabList className="tab" selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="Summary">Summary</Tab>
                <Tab value="Advice">Advice</Tab>
                <Tab value="Example">Example</Tab>
                <Tab value="Evaluation">Evaluation</Tab>
            </TabList>
            {loading ? (
                <Skeleton3Rows />
            ) : (
                <div>
                    {selectedValue === "Summary" && (
                        <>
                            <div>{getTabContent("Summary", "Summary")}</div>
                            <div>{getTabContent("Products", "Products")}</div>
                            <div>{getTabContent("Keywords", "Keywords")}</div>
                        </>
                    )}
                    {selectedValue === "Advice" && (
                        <div>{getTabContent("Advice", "Advice")}</div>
                    )}
                    {selectedValue === "Example" && (
                        <div>{getTabContent("Example", "Example")}</div>
                    )}
                    {selectedValue === "Evaluation" && (
                        <div>{getTabContent("Evaluation", "Evaluation")}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardTabs;
