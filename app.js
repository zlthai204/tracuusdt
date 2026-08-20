// =====================================================
// SUPABASE CONFIG
// =====================================================

const SUPABASE_URL =
  "https://fwamplkwgsxotcykqxhd.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_l7M95el4HZhbXCj4rzq9pg_-1MoyZoQ";


// Kiểm tra thư viện Supabase

if (!window.supabase) {

  alert(
    "Không tải được thư viện Supabase. " +
    "Hãy kiểm tra kết nối Internet."
  );

  throw new Error(
    "Supabase library chưa được load."
  );
}


// Khởi tạo Supabase

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


console.log(
  "✅ Supabase client đã khởi tạo"
);


// =====================================================
// DOM
// =====================================================

const searchInput =
  document.getElementById(
    "searchInput"
  );

const searchButton =
  document.getElementById(
    "searchButton"
  );

const results =
  document.getElementById(
    "results"
  );

const resultCount =
  document.getElementById(
    "resultCount"
  );

const customerForm =
  document.getElementById(
    "customerForm"
  );

const saveButton =
  document.getElementById(
    "saveButton"
  );


// =====================================================
// HÀM CHUẨN HÓA SỐ ĐIỆN THOẠI
// =====================================================

function cleanPhone(phone) {

  return String(phone || "")
    .replace(/\D/g, "");
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// =====================================================
// TÌM KIẾM
// =====================================================

async function searchCustomers() {

  let keyword =
    searchInput.value.trim();

  keyword =
    cleanPhone(keyword);


  if (!keyword) {

    showEmpty(
      "⚠️ Vui lòng nhập số điện thoại."
    );

    return;
  }


  if (
    keyword.length < 2
  ) {

    showEmpty(
      "⚠️ Vui lòng nhập ít nhất 2 số."
    );

    return;
  }


  searchButton.disabled = true;

  searchButton.textContent =
    "⏳ Đang tìm";


  results.innerHTML = `
    <div class="loading">
      🔎 Đang tìm kiếm...
    </div>
  `;


  try {

    let query =
      supabaseClient
        .from("customers")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    // Full số điện thoại
    // hoặc 5 số trở lên

    if (keyword.length >= 5) {

      query =
        query.eq(
          "phone",
          keyword
        );

    }

    // 2 - 4 số cuối

    else {

      query =
        query.ilike(
          "phone",
          `%${keyword}`
        );

    }


    const {
      data,
      error
    } = await query;


    if (error) {

      console.error(
        "Supabase error:",
        error
      );

      throw error;
    }


    renderResults(
      data || []
    );

  }

  catch (error) {

    console.error(error);

    showEmpty(
      "❌ Không thể truy cập database.<br><br>" +
      escapeHTML(
        error.message ||
        "Lỗi không xác định"
      )
    );

  }

  finally {

    searchButton.disabled =
      false;

    searchButton.textContent =
      "🔍 Tìm";
  }
}


// =====================================================
// HIỂN THỊ KẾT QUẢ
// =====================================================

function renderResults(data) {

  resultCount.textContent =
    `${data.length} kết quả`;


  if (!data.length) {

    results.innerHTML = `
      <div class="empty">
        🔍 Không tìm thấy khách hàng.
      </div>
    `;

    return;
  }


  results.innerHTML =
    data.map(
      customer =>
        createCustomerHTML(
          customer
        )
    ).join("");
}


// =====================================================
// TẠO HTML KHÁCH HÀNG
// =====================================================

function createCustomerHTML(customer) {

  const addressParts = [

    customer.address,

    customer.hamlet
      ? `Ấp ${customer.hamlet}`
      : "",

    customer.commune,

    customer.district,

    customer.province

  ].filter(Boolean);


  const address =
    addressParts.join(", ");


  return `

    <div
      class="customer"
      data-id="${escapeHTML(customer.id)}"
    >

      <div class="customer-top">

        <div>

          <div class="customer-name">

            ${
              escapeHTML(
                customer.customer_name ||
                "Chưa có tên"
              )
            }

          </div>


          <div class="customer-phone">

            📞
            ${escapeHTML(customer.phone)}

          </div>

        </div>


        <div class="action-buttons">

          <button
            class="edit-button"
            onclick="editCustomer('${customer.id}')"
          >
            ✏️ Sửa
          </button>


          <button
            class="delete-button"
            onclick="deleteCustomer('${customer.id}')"
          >
            🗑️ Xóa
          </button>

        </div>

      </div>


      <div class="info-grid">

        <div class="info-item">

          🚚 <b>Shipper:</b><br>

          ${
            escapeHTML(
              customer.shipper_name ||
              "Chưa có"
            )
          }

        </div>


        <div class="info-item">

          🔧 <b>Người chạy/lắp:</b><br>

          ${
            escapeHTML(
              customer.installer_name ||
              "Chưa có"
            )
          }

        </div>

      </div>


      ${
        address
          ? `
            <div class="address">

              📍 <b>Địa chỉ:</b><br>

              ${escapeHTML(address)}

            </div>
          `
          : ""
      }


      ${
        customer.note
          ? `
            <div class="note">

              📝 <b>Ghi chú:</b><br>

              ${escapeHTML(
                customer.note
              )}

            </div>
          `
          : ""
      }

    </div>

  `;
}


// =====================================================
// THÊM KHÁCH HÀNG
// =====================================================

customerForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const phone =
      cleanPhone(
        document
          .getElementById("phone")
          .value
      );


    if (!phone) {

      alert(
        "⚠️ Vui lòng nhập số điện thoại."
      );

      return;
    }


    if (
      phone.length < 8
    ) {

      alert(
        "⚠️ Số điện thoại không hợp lệ."
      );

      return;
    }


    const customer = {

      phone:

        phone,


      customer_name:

        document
          .getElementById(
            "customer_name"
          )
          .value
          .trim(),


      shipper_name:

        document
          .getElementById(
            "shipper_name"
          )
          .value
          .trim(),


      installer_name:

        document
          .getElementById(
            "installer_name"
          )
          .value
          .trim(),


      hamlet:

        document
          .getElementById(
            "hamlet"
          )
          .value
          .trim(),


      commune:

        document
          .getElementById(
            "commune"
          )
          .value
          .trim(),


      district:

        document
          .getElementById(
            "district"
          )
          .value
          .trim(),


      province:

        document
          .getElementById(
            "province"
          )
          .value
          .trim(),


      address:

        document
          .getElementById(
            "address"
          )
          .value
          .trim(),


      note:

        document
          .getElementById(
            "note"
          )
          .value
          .trim()

    };


    saveButton.disabled =
      true;

    saveButton.textContent =
      "⏳ Đang lưu...";


    try {

      // Kiểm tra số điện thoại
      // đã tồn tại chưa

      const {
        data: existing,
        error: checkError
      } =
        await supabaseClient
          .from("customers")
          .select("id")
          .eq(
            "phone",
            phone
          )
          .limit(1);


      if (checkError) {

        throw checkError;
      }


      if (
        existing &&
        existing.length > 0
      ) {

        alert(
          "⚠️ Số điện thoại này đã có trong database."
        );

        return;
      }


      const {
        error
      } =
        await supabaseClient
          .from("customers")
          .insert([
            customer
          ]);


      if (error) {

        throw error;
      }


      alert(
        "✅ Đã thêm khách hàng thành công!"
      );


      customerForm.reset();


      // Tự động tìm lại

      searchInput.value =
        phone;

      await searchCustomers();

    }

    catch (error) {

      console.error(
        "Insert error:",
        error
      );


      alert(
        "❌ Không thể lưu.\n\n" +
        (
          error.message ||
          "Lỗi database"
        )
      );

    }

    finally {

      saveButton.disabled =
        false;

      saveButton.textContent =
        "💾 Lưu khách hàng";
    }

  }
);


// =====================================================
// XÓA KHÁCH HÀNG
// =====================================================

async function deleteCustomer(id) {

  const confirmed =
    confirm(
      "Bạn có chắc muốn xóa khách hàng này?"
    );


  if (!confirmed) {

    return;
  }


  try {

    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .delete()
        .eq(
          "id",
          id
        );


    if (error) {

      throw error;
    }


    alert(
      "✅ Đã xóa khách hàng."
    );


    await searchCustomers();

  }

  catch (error) {

    console.error(error);


    alert(
      "❌ Không thể xóa.\n\n" +
      (
        error.message ||
        "Lỗi database"
      )
    );
  }
}


// =====================================================
// SỬA KHÁCH HÀNG
// =====================================================

async function editCustomer(id) {

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("customers")
        .select("*")
        .eq(
          "id",
          id
        )
        .single();


    if (error) {

      throw error;
    }


    document.getElementById(
      "phone"
    ).value =
      data.phone || "";


    document.getElementById(
      "customer_name"
    ).value =
      data.customer_name || "";


    document.getElementById(
      "shipper_name"
    ).value =
      data.shipper_name || "";


    document.getElementById(
      "installer_name"
    ).value =
      data.installer_name || "";


    document.getElementById(
      "hamlet"
    ).value =
      data.hamlet || "";


    document.getElementById(
      "commune"
    ).value =
      data.commune || "";


    document.getElementById(
      "district"
    ).value =
      data.district || "";


    document.getElementById(
      "province"
    ).value =
      data.province || "";


    document.getElementById(
      "address"
    ).value =
      data.address || "";


    document.getElementById(
      "note"
    ).value =
      data.note || "";


    saveButton.textContent =
      "🔄 Cập nhật khách hàng";


    // Đổi chức năng submit
    // sang update

    customerForm.dataset.editId =
      id;


    customerForm.scrollIntoView({
      behavior: "smooth"
    });

  }

  catch (error) {

    console.error(error);

    alert(
      "❌ Không thể lấy thông tin khách hàng."
    );
  }
}


// =====================================================
// XỬ LÝ UPDATE
// =====================================================

customerForm.addEventListener(
  "submit",
  async function(event) {

    const editId =
      customerForm.dataset.editId;


    if (!editId) {

      return;
    }


    event.preventDefault();


    const phone =
      cleanPhone(
        document
          .getElementById("phone")
          .value
      );


    const updatedCustomer = {

      phone,

      customer_name:
        document
          .getElementById(
            "customer_name"
          )
          .value
          .trim(),

      shipper_name:
        document
          .getElementById(
            "shipper_name"
          )
          .value
          .trim(),

      installer_name:
        document
          .getElementById(
            "installer_name"
          )
          .value
          .trim(),

      hamlet:
        document
          .getElementById(
            "hamlet"
          )
          .value
          .trim(),

      commune:
        document
          .getElementById(
            "commune"
          )
          .value
          .trim(),

      district:
        document
          .getElementById(
            "district"
          )
          .value
          .trim(),

      province:
        document
          .getElementById(
            "province"
          )
          .value
          .trim(),

      address:
        document
          .getElementById(
            "address"
          )
          .value
          .trim(),

      note:
        document
          .getElementById(
            "note"
          )
          .value
          .trim(),

      updated_at:
        new Date().toISOString()

    };


    try {

      saveButton.disabled =
        true;

      saveButton.textContent =
        "⏳ Đang cập nhật...";


      const {
        error
      } =
        await supabaseClient
          .from("customers")
          .update(
            updatedCustomer
          )
          .eq(
            "id",
            editId
          );


      if (error) {

        throw error;
      }


      alert(
        "✅ Đã cập nhật."
      );


      customerForm.reset();

      delete customerForm.dataset.editId;


      saveButton.textContent =
        "💾 Lưu khách hàng";


      if (phone) {

        searchInput.value =
          phone;

        await searchCustomers();
      }

    }

    catch (error) {

      console.error(error);

      alert(
        "❌ Không thể cập nhật.\n\n" +
        (
          error.message ||
          "Lỗi database"
        )
      );

    }

    finally {

      saveButton.disabled =
        false;

      if (
        !customerForm.dataset.editId
      ) {

        saveButton.textContent =
          "💾 Lưu khách hàng";
      }
    }

  }
);


// =====================================================
// EMPTY
// =====================================================

function showEmpty(message) {

  results.innerHTML = `

    <div class="empty">

      ${message}

    </div>

  `;


  resultCount.textContent =
    "0 kết quả";
}


// =====================================================
// ENTER ĐỂ TÌM
// =====================================================

searchInput.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      searchCustomers();

    }

  }
);


// =====================================================
// KIỂM TRA KẾT NỐI
// =====================================================

async function testConnection() {

  try {

    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .select("id")
        .limit(1);


    if (error) {

      console.error(
        "❌ Database error:",
        error
      );

      return false;
    }


    console.log(
      "✅ Kết nối database thành công!"
    );

    return true;

  }

  catch (error) {

    console.error(
      "❌ Connection error:",
      error
    );

    return false;
  }
}


// Chạy kiểm tra

testConnection();
