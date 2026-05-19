import UserTable from '../components/UserTable';
import '../styles/user.css';

function UserPage() {
  return (
    <section className="user-page stack">
      <div className="page-header">
        <div>
          <h2>Users</h2>
          <p>Manage users and roles.</p>
        </div>
      </div>
      <UserTable users={[]} />
    </section>
  );
}

export default UserPage;
