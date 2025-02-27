export const fetchNews = async () => {
    try {
      const response = await fetch("/data.json"); // Переконайся, що файл знаходиться у public/
      const data = await response.json();
      return data.news; // Повертаємо лише новини
    } catch (error) {
      console.error("Помилка завантаження новин:", error);
      return [];
    }
  };