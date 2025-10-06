import axios from "axios";

export const fetchUserData = async (reg_id: string) => {
  try {
    const response = await fetch(
      `https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?reg_id=${reg_id}&type=getuser`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract the first user object from user_data array
    if (data.status === "success" && data.message?.user_data?.length > 0) {
      return data.message.user_data[0]; // <-- return user object here
    } else {
      console.warn("No user data found in response");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};

const BANNER_API_URL =
  "https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=banner";

export const fetchBannerImages = async (): Promise<string[]> => {
  try {
    const response = await axios.get(BANNER_API_URL);

    // Extract images from the nested response
    const images = response.data?.message?.get_banner?.map(
      (item: { banner_img: string }) => item.banner_img
    );

    return images || [];
  } catch (error) {
    console.error("Error fetching banner images:", error);
    throw error;
  }
};

// components/utils/api.ts
export const getPackageIngfo = async (regId: string) => {
  try {
    const response = await fetch(
      `https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=getpackageinfo&reg_id=${regId}`
    );

    const json = await response.json();

    if (json.status === "success" && json.message?.packageinfo) {
      return json.message?.packageinfo; // return just the data
    } else {
      console.warn("Invalid data format");
      return [];
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return [];
  }
};

export const getPackageIngfoForUser = async (regId: string) => {
  try {
    const response = await fetch(
      `https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=getpackageinfo_user&reg_id=${regId}`
    );

    const json = await response.json();

    if (json.status === "success" && json.message?.packageinfo) {
      return json.message?.packageinfo; // return just the data
    } else {
      console.warn("Invalid data format");
      return [];
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return [];
  }
};

// utils/fetchCMSData.ts
export const fetchCMSData = async (column: string) => {
  try {
    const response = await fetch(
      `https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=get_newdata&column=${column}`
    );

    const text = await response.text();
    // Now parse JSON safely
    const data = JSON.parse(text);

    if (data.status === "success") {
      const html = data.message[column]?.[0] || ""; // safer extraction with your column
      return { success: true, data: html };
    } else {
      return { success: false, error: "Failed to fetch data" };
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: "An error occurred while fetching data" };
  }
};

export const fetchShopServices = async () => {
  try {
    const response = await axios.get(
      "https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=shopservice"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shop services:", error);
    throw error;
  }
};

export const fetchShopServiceDetail = async (service_id: string) => {
  try {
    const response = await axios.get(
      `https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php`,
      {
        params: {
          type: "shopservicedetail",
          service_id,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shop service detail:", error);
    throw error;
  }
};

export const fetchAllWalletData = async (regId: number) => {
  try {
    const response = await axios.post(
      "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php", // replace with your API URL
      {
        type: "get_wallet_referral", // your API uses 'type' to identify action
        reg_id: regId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      console.log("Wallet Data:", response.data);
      return response.data;
    } else {
      console.log("Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};
