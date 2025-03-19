import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEllipsisVertical, faPen, faTrash, faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: Date;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="users-container">
      <div class="users-header">
        <button class="add-btn" (click)="onAddUser()">
          <fa-icon [icon]="faPlus"></fa-icon>
          إضافة مستخدم
        </button>
      </div>

      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>آخر نشاط</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>
                <div class="email">
                  <fa-icon [icon]="faEnvelope"></fa-icon>
                  {{ user.email }}
                </div>
              </td>
              <td>
                <span class="role-badge">{{ user.role }}</span>
              </td>
              <td>{{ user.lastActive | date:'yyyy/MM/dd' }}</td>
              <td>
                <div class="actions">
                  <button class="action-btn" (click)="editUser(user)">
                    <fa-icon [icon]="faPen"></fa-icon>
                  </button>
                  <button class="action-btn" (click)="deleteUser(user)">
                    <fa-icon [icon]="faTrash"></fa-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .users-header {
      margin-bottom: 2rem;
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #4573d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .add-btn:hover {
      background: #3b63b8;
    }

    .users-table {
      flex: 1;
      overflow-x: auto;
      border: 1px solid var(--border-color);
      border-radius: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: right;
      color: var(--text-color);
      border-bottom: 1px solid var(--border-color);
    }

    th {
      background: var(--input-bg);
      font-weight: 500;
    }

    .email {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-color);
      opacity: 0.8;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: var(--input-bg);
      border-radius: 12px;
      font-size: 0.9rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      opacity: 0.7;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--input-bg);
      opacity: 1;
    }

    @media (max-width: 768px) {
      .users-table {
        margin: 0 -1rem;
        border-radius: 0;
        border-left: none;
        border-right: none;
      }
    }
  `]
})
export class UsersComponent {
  // Font Awesome icons
  faPlus = faPlus;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faEnvelope = faEnvelope;

  users: User[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'مدير',
      lastActive: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'سارة أحمد',
      email: 'sara@example.com',
      role: 'محرر',
      lastActive: new Date('2024-01-14')
    },
    {
      id: '3',
      name: 'محمد علي',
      email: 'mohamed@example.com',
      role: 'مشاهد',
      lastActive: new Date('2024-01-13')
    }
  ];

  onAddUser() {
    // TODO: Implement add user logic
    console.log('Add user clicked');
  }

  editUser(user: User) {
    // TODO: Implement edit user logic
    console.log('Edit user:', user);
  }

  deleteUser(user: User) {
    // TODO: Implement delete user logic
    console.log('Delete user:', user);
  }
}