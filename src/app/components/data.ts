export const sampleData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    age: Math.floor(Math.random() * 50) + 18, // Age between 18-67
    email: `user${i + 1}@example.com`,
    role: ["Admin", "Editor", "Viewer"][Math.floor(Math.random() * 3)],
  }));
  