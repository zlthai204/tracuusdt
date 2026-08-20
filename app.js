const SUPABASE_URL = "fwamplkwgsxotcykqxhd";
const SUPABASE_ANON_KEY = "ap-southeast-2";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// =============================
// TÌM KIẾM
// =============================

async function searchCustomers() {

  const input = document
    .getElementById("searchInput")
    .value
    .trim();

  if (!input) {
    showEmpty("Vui lòng nhập số điện thoại.");
    return;
  }

  const results = document.getElementById("results");

  results.innerHTML = `
    <div class="empty">
      ⏳ Đang tìm kiếm...
    </div>
  `;

  try {

    let query = supabaseClient
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    // Full số điện thoại
    if (input.length >= 5) {

      query = query.eq("phone", input);

    } else {

      // Tìm 2 - 4 số cuối
      query = query.ilike(
        "phone",
        `%${input}`
      );

    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    renderResults(data || []);

  } catch (error) {

    console.error(error);

    showEmpty(
      "❌ Không thể kết nối database."
    );
  }
}


// =============================
// HIỂN THỊ KẾT QUẢ
// =============================

function renderResults(data) {

  const results = document.getElementById("results");
  const count = document.getElementById("resultCount");

  count.textContent = `${data.length} kết quả`;

  if (!data.length) {

    results.innerHTML = `
      <div class="empty">
        Không tìm thấy khách hàng.
      </div>
    `;

    return;
  }

  results.innerHTML = data.map(customer => {

    const address = [
      customer.address,
      customer.hamlet,
      customer.commune,
      customer.district,
      customer.province
    ]
      .filter(Boolean)
      .join(", ");

    return `
      <div class="customer">

        <div class="customer-header">

          <div>
            <div class="customer-name">
              ${escapeHTML(customer.customer_name || "Chưa có tên")}
            </div>

            <div class="phone">
              📞 ${escapeHTML(customer.phone)}
            </div>
          </div>

          <button
            class="delete-btn"
            onclick="deleteCustomer('${customer.id}')"
          >
            Xóa
          </button>

        </div>

        <div class="info">

          <div>
            🚚 <b>Shipper:</b>
            ${escapeHTML(customer.shipper_name || "Chưa có")}
          </div>

          <div>
            🔧 <b>Người chạy/lắp:</b>
            ${escapeHTML(customer.installer_name || "Chưa có")}
          </div>

        </div>

        ${
          address
          ? `
            <div class="note">
              📍 <b>Địa chỉ:</b>
              ${escapeHTML(address)}
            </div>
          `
          : ""
        }

        ${
          customer.note
          ? `
            <div class="note">
              📝 <b>Ghi chú:</b>
              ${escapeHTML(customer.note)}
            </div>
          `
          : ""
        }

      </div>
    `;

  }).join("");
}


// =============================
// THÊM KHÁCH HÀNG
// =============================

document
  .getElementById("customerForm")
  .addEventListener("submit", async function(event) {

    event.preventDefault();

    const customer = {

      phone:
        document.getElementById("phone").value.trim(),

      customer_name:
        document.getElementById("customer_name").value.trim(),

      shipper_name:
        document.getElementById("shipper_name").value.trim(),

      installer_name:
        document.getElementById("installer_name").value.trim(),

      hamlet:
        document.getElementById("hamlet").value.trim(),

      commune:
        document.getElementById("commune").value.trim(),

      district:
        document.getElementById("district").value.trim(),

      province:
        document.getElementById("province").value.trim(),

      address:
        document.getElementById("address").value.trim(),

      note:
        document.getElementById("note").value.trim()

    };

    if (!customer.phone) {

      alert("Vui lòng nhập số điện thoại.");

      return;
    }

    try {

      const { error } =
        await supabaseClient
          .from("customers")
          .insert([customer]);

      if (error) {
        throw error;
      }

      alert("✅ Đã lưu khách hàng.");

      document
        .getElementById("customerForm")
        .reset();

      searchCustomers();

    } catch (error) {

      console.error(error);

      alert(
        "❌ Không thể lưu dữ liệu.\n\n" +
        error.message
      );

    }

  });


// =============================
// XÓA
// =============================

async function deleteCustomer(id) {

  const confirmDelete =
    confirm(
      "Bạn có chắc muốn xóa khách hàng này?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    const { error } =
      await supabaseClient
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) {
      throw error;
    }

    alert("Đã xóa.");

    searchCustomers();

  } catch (error) {

    console.error(error);

    alert(
      "Không thể xóa dữ liệu."
    );
  }
}


// =============================
// TIỆN ÍCH
// =============================

function showEmpty(message) {

  document.getElementById("results").innerHTML =
    `<div class="empty">${message}</div>`;

  document.getElementById("resultCount")
    .textContent = "0 kết quả";
}


function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// Enter để tìm
document
  .getElementById("searchInput")
  .addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
      searchCustomers();
    }

  });
