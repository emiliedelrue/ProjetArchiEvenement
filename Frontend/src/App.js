import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Events from './components/Events';
import Tickets from './components/Tickets';
import Reservations from './components/Reservations';

// Composant pour protéger les routes authentifiées
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
}

// Composant App principal avec routage
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/events" 
                    element={
                        <ProtectedRoute>
                            <Events />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/events/:eventId/tickets" 
                    element={
                        <ProtectedRoute>
                            <Tickets />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/reservations" 
                    element={
                        <ProtectedRoute>
                            <Reservations />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/events" 
                    element={
                        <ProtectedRoute>
                            <Events />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
