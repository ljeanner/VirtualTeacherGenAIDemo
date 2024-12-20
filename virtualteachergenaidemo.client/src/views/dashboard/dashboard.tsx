import "./dashboard.css";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatHistory, { IChat } from '../../components/dashboard/chatHistory';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-button';
import DashboardTabs from '../../components/dashboard/dashboardTabs';
import { useUsername } from '../../auth/UserContext';
import DashboardService from '../../services/DashboardService';

enum AuthorRoles {
    User = 0,
    Assistant = 1,
}

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessionId } = location.state;
    const [conversation, setConversation] = useState<IChat[]>([]);
    const [formattedConversation, setFormattedConversation] = useState<string>("");
    const userName = useUsername();

    const handleBackClick = () => {
        navigate('/lastTraining');
    };

    useEffect(() => {
        getConversation(sessionId);
    }, [sessionId]);

    const getConversation = async (sessionId: string) => {
        const data = await DashboardService.getConversation(sessionId);
        const formattedConversation = data.map((message: any) => {
            const role = message.authorRole === AuthorRoles.User ? "Seller" : "Client";
            return `${role}: ${message.content}`;
        }).join("\n");
        setConversation(data);
        setFormattedConversation(formattedConversation);
    };

    return (
        <div className="grid-container">
            <div className="header">
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled />} />
                    </div>
                    <h1 className="title">Your Dashboard</h1>
                    <p className="intro">
                        Your personal dashboard will display all information about a simulation. You can review the discussion, the summary, advice and the feedback.
                    </p>
                </section>
            </div>
            <div className="chat">
                <div className="chatHistoryTitle">Conversation</div>
                <ChatHistory conversation={conversation} />
            </div>
            <div className="dashboard">
                <DashboardTabs sessionId={sessionId} conversation={formattedConversation} userName={userName} />
            </div>
        </div>
    );
}

export default Dashboard;
