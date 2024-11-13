import './scenarioList.css';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardPreview, CardFooter } from '@fluentui/react-card';
import { Text, Title2, Body2 } from '@fluentui/react-text';
import { ScenarioItem } from '../../models/ScenarioItem';
import { Button } from '@fluentui/react-button';
import ScenarioDialog from './scenarioDialog';
import ChatWindow from '../chat/chatWindow';
import { Spinner } from '@fluentui/react-spinner';
import { makeStyles } from '@fluentui/react-components';
import { PersonAvailableFilled, AddCircleRegular, EditRegular} from '@fluentui/react-icons';
import { mergeClasses } from '@fluentui/react-components';
import { tokens } from '@fluentui/tokens';

interface ScenarioListProps {
    onScenarioSelect?: (scenario: ScenarioItem) => void;
    onScenarioStart?: () => void;
}

const useStyles = makeStyles({
    customPreview: {
        padding: '10px',
    },
    customCard: {
        minWidth: '400px',
        maxWidth: '300px',
    },
    iconGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
    },
    iconItem: {
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        marginTop: '20px',
    },
    icon: {
        fontSize: '40px',
    },
    iconText: {
        marginTop: '5px',
    },
    grayColor: {
        color: tokens.colorNeutralForegroundDisabled,
    },
    systemColor: {
        color: tokens.colorPaletteLilacForeground2,
    },
    teacherColor: {
        color: tokens.colorPaletteLightGreenForeground1,
    },
    otherColor: {
        color: tokens.colorBrandForeground1,
    },
    centerContainer: {
        display: 'flex',
        justifyContent: 'left',
        marginTop: '10px',
    },
    buttonWithIcon: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonIcon: {
        fontSize: '48px',
        marginBottom: '5px',
    },
    editButton: {
        marginLeft: 'auto',
    },
});

const getAgentColorClass = (agentType: string, classes: any) => {
    switch (agentType) {
        case 'system':
            return classes.systemColor;
        case 'teacher':
            return classes.teacherColor;
        default:
            return classes.otherColor;
    }
};

const ScenarioList: React.FC<ScenarioListProps> = ({ onScenarioStart }) => {
    const classes = useStyles();
    const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
    const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch scenarios from an API or data source
        fetch('/api/scenario')
            .then(response => response.json())
            .then(data => {
                setScenarios(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching scenarios:', error);
                setIsLoading(false);
            });

    }, []);

    const handleStartClick = async (scenario: ScenarioItem) => {
        try {
            setIsLoading(true);
            setSelectedScenario(scenario);
            setIsChatOpen(true);
            if (onScenarioStart) {
                onScenarioStart();
            }
        } catch (error) {
            console.error('Error fetching scenario details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const areAllAgentsSet = (scenario: ScenarioItem) => {
        return scenario.agents.length === 3;
    };

    const handleAddScenario = () => {
        setSelectedScenario(null);
        setIsDialogOpen(true);
    };

    const handleEditScenario = (scenario: ScenarioItem) => {
        setSelectedScenario(scenario);
        setIsDialogOpen(true);
    };

    const handleScenarioAddedOrEdited = (scenario: ScenarioItem) => {
        setScenarios((prevScenarios) => {
            const existingScenarioIndex = prevScenarios.findIndex((s) => s.id === scenario.id);
            if (existingScenarioIndex !== -1) {
                // Update existing scenario
                const updatedScenarios = [...prevScenarios];
                updatedScenarios[existingScenarioIndex] = scenario;

                return updatedScenarios;
            } else {
                // Add new scenario
                return [...prevScenarios, scenario];
            }
        });
        setIsDialogOpen(false);
        setSelectedScenario(null);
    };

    const handleDeleteScenario = (scenarioId: string) => {
        setScenarios(prevScenarios => prevScenarios.filter(scenario => scenario.id !== scenarioId));
    };

    return (
        <div className={classes.centerContainer}>
            {isLoading && <Spinner label="Loading..." />}
            {!isLoading && !isChatOpen && (
                <div className="scenario-cards-grid">
                    <Button className={classes.buttonWithIcon} onClick={handleAddScenario}>
                        <AddCircleRegular className={classes.buttonIcon} />
                        Add New Scenario
                    </Button>
                    {scenarios.map(scenario => (
                        <Card key={scenario.id} className={`${classes.customCard} card`}>
                            <CardHeader
                                header={<Title2>{scenario.name}</Title2>}
                            />
                            <CardPreview className={classes.customPreview}>
                                <div className={classes.iconGrid}>
                                    <div><Body2>{scenario.description}</Body2></div>
                                    <div className={classes.iconGrid}>
                                        {[0, 1, 2].map(index => {
                                            const agent = scenario.agents[index];
                                            const colorClass = agent ? getAgentColorClass(agent.type, classes) : classes.grayColor;
                                            return (
                                                <div key={index} className={classes.iconItem}>
                                                    <PersonAvailableFilled
                                                        className={mergeClasses(classes.icon, colorClass)}
                                                    />
                                                    <Text className={mergeClasses(classes.iconText, colorClass)}>
                                                        {agent ? agent.name : 'Not set'}
                                                    </Text>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardPreview>
                            <CardFooter>

                                <Button
                                    icon={<EditRegular />}
                                    className={classes.editButton}
                                    onClick={() => handleEditScenario(scenario)}>
                                    Edit
                                </Button>
                                <Button
                                    appearance='primary'
                                    onClick={() => handleStartClick(scenario)}
                                    disabled={!areAllAgentsSet(scenario)}>Start
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            {isDialogOpen && (
                <ScenarioDialog
                    isOpen={isDialogOpen}
                    scenario={selectedScenario}
                    onAddScenario={handleScenarioAddedOrEdited}
                    onDeleteScenario={handleDeleteScenario}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
            {isChatOpen && selectedScenario && (
                <ChatWindow scenario={selectedScenario} />
            )}
        </div>
    );
};

export default ScenarioList;