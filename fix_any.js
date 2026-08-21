const fs = require('fs');

let app = fs.readFileSync('frontend/src/App.tsx', 'utf8');
app = app.replace('handleAddItem = async (data: any)', 'handleAddItem = async (data: Partial<Post>)');
fs.writeFileSync('frontend/src/App.tsx', app);

let auth = fs.readFileSync('frontend/src/services/authService.ts', 'utf8');
auth = auth.replace('register: async (data: any)', 'register: async (data: Record<string, unknown>)');
auth = auth.replace('login: async (data: any)', 'login: async (data: Record<string, unknown>)');
fs.writeFileSync('frontend/src/services/authService.ts', auth);

let item = fs.readFileSync('frontend/src/services/itemService.ts', 'utf8');
item = item.replace('export async function insertItem(itemData: any)', 'export async function insertItem(itemData: Record<string, unknown>)');
fs.writeFileSync('frontend/src/services/itemService.ts', item);

let home = fs.readFileSync('frontend/src/components/HomeFeed.tsx', 'utf8');
home = home.replace('handleCreateInitiative = async (newInit: any)', 'handleCreateInitiative = async (newInit: Record<string, unknown>)');
fs.writeFileSync('frontend/src/components/HomeFeed.tsx', home);

let mySwaps = fs.readFileSync('frontend/src/components/MySwapsView.tsx', 'utf8');
mySwaps = mySwaps.replace('handleAddRating = async (ratingData: any)', 'handleAddRating = async (ratingData: Record<string, unknown>)');
mySwaps = mySwaps.replace('data.asLender.map((s: any)', 'data.asLender.map((s: Record<string, unknown>)');
mySwaps = mySwaps.replace('data.asBorrower.map((s: any)', 'data.asBorrower.map((s: Record<string, unknown>)');
fs.writeFileSync('frontend/src/components/MySwapsView.tsx', mySwaps);

let search = fs.readFileSync('frontend/src/components/SearchView.tsx', 'utf8');
search = search.replace('data.map((item: any)', 'data.map((item: Record<string, unknown>)');
fs.writeFileSync('frontend/src/components/SearchView.tsx', search);

let topbar = fs.readFileSync('frontend/src/components/layout/TopAppBar.tsx', 'utf8');
topbar = topbar.replace('data.filter((n: any)', 'data.filter((n: Record<string, unknown>)');
fs.writeFileSync('frontend/src/components/layout/TopAppBar.tsx', topbar);

let editModal = fs.readFileSync('frontend/src/components/profile/EditProfileModal.tsx', 'utf8');
editModal = editModal.replace('editForm: any;', 'editForm: Record<string, unknown>;');
editModal = editModal.replace('setEditForm: React.Dispatch<React.SetStateAction<any>>;', 'setEditForm: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;');
fs.writeFileSync('frontend/src/components/profile/EditProfileModal.tsx', editModal);

console.log('Fixed any types');
