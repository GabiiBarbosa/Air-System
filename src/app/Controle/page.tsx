// app/Controle/page.tsx

import React from 'react';
import DashboardLayout from '@/src/app/Controle/Layout/DashboardLayout';
import '@/src/app/globals.css';

const DashboardLayoutAny = DashboardLayout as React.ComponentType<{ children?: React.ReactNode }>;

export default function ControlePage() {
    return (
        <DashboardLayoutAny></DashboardLayoutAny>
    );
}