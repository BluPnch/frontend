// src/pages/Home/Home.tsx
import React, { useEffect, useState } from 'react';
import { api, setAuthToken } from '../../api/api-client';

export const Home: React.FC = () => {
    const [plants, setPlants] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Setting auth token...');

                // Устанавливаем токен
                const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbWluQGdoLmNvbSIsIm5hbWVpZCI6IjIzY2EzNmFiLWRlMWEtNGFhOS05NGFhLWI2OThkY2E0NGEyNSIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwibmJmIjoxNzYzNjc1Nzg1LCJleHAiOjE3NjQyODA1ODUsImlhdCI6MTc2MzY3NTc4NX0.4C4T1XC1mB6I7HrizHSMU7UQzmg8p-pf3bx0f6-_FqM";
                setAuthToken(token);
                console.log('Token set, fetching data...');

                // Получаем растения
                const plantsResponse = await api.plants.getAll();
                console.log('Plants response:', plantsResponse);
                setPlants(plantsResponse.data);

                // Получаем сотрудников
                const employeesResponse = await api.employees.getAll();
                console.log('Employees response:', employeesResponse);
                setEmployees(employeesResponse.data);

            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(`Error: ${err.message}. Check console for details.`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading... (check browser console)</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Plants ({plants.length})</h1>
            <div>
                {plants.length === 0 ? (
                    <p>No plants found</p>
                ) : (
                    plants.map(plant => (
                        <div key={plant.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                            <h3>{plant.specie || 'Unnamed Plant'}</h3>
                            <p>Family: {plant.family}</p>
                            <p>ID: {plant.id}</p>
                            <p>Client ID: {plant.clientId}</p>
                            {plant.flower !== undefined && <p>Flower: {plant.flower}</p>}
                            {plant.fruit !== undefined && <p>Fruit: {plant.fruit}</p>}
                            {plant.reproduction !== undefined && <p>Reproduction: {plant.reproduction}</p>}
                        </div>
                    ))
                )}
            </div>

            <h1>Employees ({employees.length})</h1>
            <div>
                {employees.length === 0 ? (
                    <p>No employees found</p>
                ) : (
                    employees.map(employee => (
                        <div key={employee.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                            <h3>{employee.name} {employee.surname}</h3>
                            <p>Task: {employee.task}</p>
                            <p>Phone: {employee.phoneNumber}</p>
                            <p>Plant Domain: {employee.plantDomain}</p>
                            <p>Administrator ID: {employee.administratorId}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};