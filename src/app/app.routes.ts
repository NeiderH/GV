import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        canActivate: [AuthGuard],
        children:[
            {
                path: 'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard.component')
            },
            // ejemplo
            {
                path: 'profile',
                loadComponent: () => import('./business/profile/profile.component')
            },
            {
                path: 'tables',
                loadComponent: () => import('./business/tables/tables.component')
            },
            // reales
            {
                path: 'factura',
                loadComponent: () => import('./pages/factura/factura.component')
            },
            // {
            //     //No se usara mas
            //     path: 'inventariopb',
            //     loadComponent: () => import('./pages/inventariopb/inventariopb.component')
            // },
            {
                path: 'mercancia',
                loadComponent: () => import('./pages/mercancia/mercancia.component')
            },
            {
                path: 'observacion',
                loadComponent: () => import('./pages/observacion/observacion.component')
            },
            // {
            //     //No se usara mas
            //     path: 'platosyb',
            //     loadComponent: () => import('./pages/platosyb/platosyb.component').then(m => m.PlatosybComponent)
            // },
            {
                path: 'rfactura',
                loadComponent: () => import('./pages/rfactura/rfactura.component')
            },
            {
                path: 'rmercancia',
                loadComponent: () => import('./pages/rmercancia/rmercancia.component')
            },            
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/authentication/login/login.component')  
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/authentication/register/register.component')  
    },
    {
        path: '**',
        loadComponent: () => import('./pages/components/notfound/notfound.component'),
    }

];
