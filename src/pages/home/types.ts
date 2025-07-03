export interface Category {
	id: string;
	name: string;
	questions: number;
};

export interface CategoriesResponse {
  categories: Category[];
}