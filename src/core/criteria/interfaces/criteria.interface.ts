export interface Criteria {
  id: number;
  name: string;
  index: number;
  description: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: null;
  indicator?: Indicator;
  categories?: Categories;
}

export interface Indicator {
  id: number;
  name: string;
  index: number;
  description: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: null;
}

export interface Categories {
  id: number;
  name: string;
  description: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: null;
  contribution: Contribution[];
}

export interface Contribution {
  id: number;
  uuid: string;
  link: Link[];
  description: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: null;
  files: File[];
  user: User;
}

export interface File {
  id: number;
  name: string;
  description: string;
  path: string;
  type: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface Link {
  URL: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  birthdate: Date;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  department: Department;
}

export interface Department {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deleteAt: null;
}
