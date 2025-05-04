import React from 'react';

const users = [
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    title: 'Nhà phát triển Front-end',
    department: 'Tối ưu hóa',
    status: 'Hoạt động',
    role: 'Thành viên',
    imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    title: 'Nhà thiết kế',
    department: 'Intranet',
    status: 'Hoạt động',
    role: 'Quản trị viên',
    imgUrl: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    title: 'Giám đốc sản phẩm',
    department: 'Directives',
    status: 'Hoạt động',
    role: 'Thành viên',
    imgUrl: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
  {
    name: 'Whitney Francis',
    email: 'whitney.francis@example.com',
    title: 'Người viết nội dung',
    department: 'Chương trình',
    status: 'Hoạt động',
    role: 'Quản trị viên',
    imgUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    name: 'Leonard Krasner',
    email: 'leonard.krasner@example.com',
    title: 'Nhà thiết kế cấp cao',
    department: 'Di động',
    status: 'Hoạt động',
    role: 'Chủ sở hữu',
    imgUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    name: 'Floyd Miles',
    email: 'floyd.miles@example.com',
    title: 'Nhà thiết kế chính',
    department: 'Bảo mật',
    status: 'Hoạt động',
    role: 'Thành viên',
    imgUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
];

const UserTable = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Chức danh
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imgUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm leading-5 text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="text-sm leading-5 text-gray-900">
                    {user.title}
                  </div>
                  <div className="text-sm leading-5 text-gray-500">
                    {user.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-right text-sm leading-5 font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Chỉnh sửa
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
