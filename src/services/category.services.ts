
export async function getCategories(){
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`Category API responded with status ${response.status}. Using fallback categories.`);
    }

    const data = await response.json();
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }

  } catch (error) {
    console.warn("Could not connect to category service, falling back to local dataset:", error);
  }
}
