<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define modules and their actions
        $modules = [
            'stores' => ['view', 'create', 'edit', 'delete'],
            'clients' => ['view', 'create', 'edit', 'delete'],
            'providers' => ['view', 'create', 'edit', 'delete'],
            'categories' => ['view', 'create', 'edit', 'delete'],
            'brands' => ['view', 'create', 'edit', 'delete'],
            'products' => ['view', 'create', 'edit', 'delete'],
            'purchases' => ['view', 'create', 'edit', 'delete'],
            'transfers' => ['view', 'create', 'edit', 'delete'],
            'sales' => ['view', 'create', 'edit', 'delete'],
            'users' => ['view', 'create', 'edit', 'delete'],
            'roles' => ['view', 'create', 'edit', 'delete'],
            'reports' => ['view'],
        ];

        // Create permissions
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                ], [
                    'module' => $module,
                    'action' => $action,
                    'description' => ucfirst($action) . ' ' . $module,
                ]);
            }
        }

        // Create default roles
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Acceso completo a todo el sistema',
                'is_system' => true,
            ],
            [
                'name' => 'Administrador',
                'slug' => 'admin',
                'description' => 'Administrador del sistema',
                'is_system' => true,
            ],
            [
                'name' => 'Vendedor',
                'slug' => 'salesman',
                'description' => 'Vendedor con acceso a ventas y productos',
                'is_system' => true,
            ],
            [
                'name' => 'Reportes',
                'slug' => 'report',
                'description' => 'Solo acceso a reportes',
                'is_system' => true,
            ],
            [
                'name' => 'Almacenero',
                'slug' => 'storekeeper',
                'description' => 'Encargado de almacen y transferencias',
                'is_system' => true,
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['slug' => $roleData['slug']], $roleData);
        }

        // Assign the first user as super admin if exists and has no role
        $firstUser = User::first();
        if ($firstUser && !$firstUser->role_id) {
            $superAdminRole = Role::where('slug', 'super-admin')->first();
            if ($superAdminRole) {
                $firstUser->update(['role_id' => $superAdminRole->id]);
            }
        }
    }
}
