// ============================================================
// JT SHIPPER - APP.JS
// ============================================================


// ============================================================
// SUPABASE CONFIG
// ============================================================

const SUPABASE_URL =
  "https://fwamplkwgsxotcykqxhd.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_l7M95el4HZhbXCj4rzq9pg_-1MoyZoQ";


// ============================================================
// INIT SUPABASE
// ============================================================

if (!window.supabase) {

  console.error(
    "Không tìm thấy thư viện Supabase."
  );

  throw new Error(
    "Supabase library chưa được tải."
  );

}


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


console.log(
  "✅ JT Shipper - Supabase connected"
);


// ============================================================
// HELPER
// ============================================================

function $(id) {

  return document.getElementById(id);

}


function getValue(id) {

  const element =
    $(id);

  if (!element) {

    console.error(
      `Không tìm thấy element #${id}`
    );

    return "";

  }

  return element.value.trim();

}


function cleanPhone(phone) {

  return String(
    phone || ""
  ).replace(
    /\D/g,
    ""
  );

}


function escapeHTML(value) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ============================================================
// ELEMENTS
// ============================================================

const searchInput =
  $("searchInput");

const searchButton =
  $("searchButton");

const clearSearch =
  $("clearSearch");

const results =
  $("results");

const resultCount =
  $("resultCount");

const customerForm =
  $("customerForm");

const saveButton =
  $("saveButton");


// ============================================================
// EMPTY
// ============================================================

function showEmpty(
  title,
  description
) {

  if (!results) return;


  results.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        🔍
      </div>

      <h3>
        ${escapeHTML(title)}
      </h3>

      <p>
        ${escapeHTML(
          description ||
          "Nhập số điện thoại để bắt đầu tra cứu."
        )}
      </p>

    </div>

  `;


  if (resultCount) {

    resultCount.textContent =
      "0 kết quả";

  }

}


// ============================================================
// LOADING
// ============================================================

function showLoading() {

  if (!results) return;


  results.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        ⏳
      </div>

      <h3>
        Đang tìm kiếm...
      </h3>

      <p>
        Đang kiểm tra dữ liệu.
      </p>

    </div>

  `;

}


// ============================================================
// ERROR
// ============================================================

function showError(error) {

  console.error(
    "JT ERROR:",
    error
  );


  if (!results) return;


  const message =
    error?.message ||
    "Có lỗi xảy ra.";


  results.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        ⚠️
      </div>

      <h3>
        Không thể thực hiện
      </h3>

      <p>
        ${escapeHTML(message)}
      </p>

    </div>

  `;


  if (resultCount) {

    resultCount.textContent =
      "Lỗi";

  }

}


// ============================================================
// SEARCH
// ============================================================

async function searchCustomers() {

  if (!searchInput) {

    console.error(
      "Không có searchInput"
    );

    return;

  }


  const keyword =
    cleanPhone(
      searchInput.value
    );


  if (!keyword) {

    showEmpty(
      "Chưa nhập số điện thoại"
    );

    return;

  }


  if (keyword.length < 2) {

    showEmpty(
      "Vui lòng nhập ít nhất 2 số",
      "Bạn có thể nhập 2 - 4 số cuối hoặc full số điện thoại."
    );

    return;

  }


  if (searchButton) {

    searchButton.disabled =
      true;

    searchButton.innerHTML =
      "⏳ ĐANG TÌM...";

  }


  showLoading();


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


    // ========================================================
    // FULL SỐ
    // ========================================================

    if (keyword.length >= 5) {

      query =
        query.eq(
          "phone",
          keyword
        );

    }


    // ========================================================
    // 2 - 4 SỐ CUỐI
    // ========================================================

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
    } =
      await query;


    if (error) {

      throw error;

    }


    renderResults(
      data || []
    );

  }

  catch (error) {

    showError(
      error
    );

  }

  finally {

    if (searchButton) {

      searchButton.disabled =
        false;

      searchButton.innerHTML =
        "🔎 TRA CỨU";

    }

  }

}


// ============================================================
// RENDER
// ============================================================

function renderResults(data) {

  if (!results) return;


  if (resultCount) {

    resultCount.textContent =
      `${data.length} kết quả`;

  }


  if (!data.length) {

    showEmpty(
      "Không tìm thấy khách hàng",
      "Không có dữ liệu phù hợp với số điện thoại này."
    );

    return;

  }


  results.innerHTML =
    data
      .map(
        customer =>
          createCustomerCard(
            customer
          )
      )
      .join("");

}


// ============================================================
// CUSTOMER CARD
// ============================================================

function createCustomerCard(
  customer
) {

  const address = [

    customer.address,

    customer.hamlet
      ? `Ấp ${customer.hamlet}`
      : "",

    customer.commune
      ? `Xã ${customer.commune}`
      : ""

  ]
    .filter(Boolean)
    .join(", ");


  return `

    <div
      class="customer-card"
      style="
        background:#fff;
        border:1px solid #e2e8f0;
        border-radius:18px;
        padding:20px;
        margin-bottom:16px;
        box-shadow:0 8px 25px rgba(15,23,42,.06);
      "
    >

      <!-- HEADER -->

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:15px;
        "
      >

        <div>

          <div
            style="
              font-size:19px;
              font-weight:900;
              margin-bottom:7px;
            "
          >

            👤

            ${escapeHTML(
              customer.customer_name ||
              "Chưa có tên"
            )}

          </div>


          <div
            style="
              color:#2563eb;
              font-weight:900;
              font-size:15px;
            "
          >

            📞

            ${escapeHTML(
              customer.phone ||
              ""
            )}

          </div>

        </div>


        <div
          style="
            display:flex;
            gap:7px;
            flex-wrap:wrap;
          "
        >

          <button
            type="button"
            onclick="editCustomer('${customer.id}')"
            style="
              border:0;
              background:#eff6ff;
              color:#2563eb;
              padding:8px 11px;
              border-radius:9px;
              cursor:pointer;
              font-weight:800;
            "
          >
            ✏️ Sửa
          </button>


          <button
            type="button"
            onclick="deleteCustomer('${customer.id}')"
            style="
              border:0;
              background:#fef2f2;
              color:#dc2626;
              padding:8px 11px;
              border-radius:9px;
              cursor:pointer;
              font-weight:800;
            "
          >
            🗑️ Xóa
          </button>

        </div>

      </div>


      <!-- INFO -->

      <div
        style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
          margin-top:18px;
        "
      >

        <div
          style="
            background:#f8fafc;
            border-radius:12px;
            padding:13px;
            line-height:1.7;
          "
        >

          🚚

          <b>
            Shipper chạy
          </b>

          <br>

          ${escapeHTML(
            customer.shipper_name ||
            "Chưa có"
          )}

        </div>


        <div
          style="
            background:#f8fafc;
            border-radius:12px;
            padding:13px;
            line-height:1.7;
          "
        >

          🔧

          <b>
            Người chạy / lắp
          </b>

          <br>

          ${escapeHTML(
            customer.installer_name ||
            "Chưa có"
          )}

        </div>

      </div>


      <!-- ADDRESS -->

      ${
        address

          ? `

            <div
              style="
                margin-top:10px;
                background:#eff6ff;
                border-radius:12px;
                padding:13px;
                line-height:1.7;
              "
            >

              📍

              <b>
                Địa chỉ
              </b>

              <br>

              ${escapeHTML(address)}

            </div>

          `

          : ""
      }


      <!-- NOTE -->

      ${
        customer.note

          ? `

            <div
              style="
                margin-top:10px;
                background:#fff7ed;
                border-radius:12px;
                padding:13px;
                line-height:1.7;
              "
            >

              📝

              <b>
                Ghi chú
              </b>

              <br>

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


// ============================================================
// FORM DATA
// ============================================================

function getFormData() {

  return {

    phone:
      cleanPhone(
        getValue("phone")
      ),

    customer_name:
      getValue(
        "customer_name"
      ),

    shipper_name:
      getValue(
        "shipper_name"
      ),

    installer_name:
      getValue(
        "installer_name"
      ),

    hamlet:
      getValue(
        "hamlet"
      ),

    commune:
      getValue(
        "commune"
      ),

    address:
      getValue(
        "address"
      ),

    note:
      getValue(
        "note"
      )

  };

}


// ============================================================
// RESET FORM
// ============================================================

function resetForm() {

  if (!customerForm) return;


  customerForm.reset();


  delete customerForm.dataset.editId;


  if (saveButton) {

    saveButton.disabled =
      false;

    saveButton.innerHTML =
      "💾 LƯU KHÁCH HÀNG";

  }

}


// ============================================================
// SUBMIT FORM
// ============================================================

if (customerForm) {

  customerForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const formData =
        getFormData();


      if (!formData.phone) {

        alert(
          "⚠️ Vui lòng nhập số điện thoại."
        );

        return;

      }


      if (
        formData.phone.length < 8
      ) {

        alert(
          "⚠️ Số điện thoại không hợp lệ."
        );

        return;

      }


      const editId =
        customerForm.dataset.editId;


      if (editId) {

        await updateCustomer(
          editId,
          formData
        );

      }

      else {

        await addCustomer(
          formData
        );

      }

    }
  );

}


// ============================================================
// ADD CUSTOMER
// ============================================================

async function addCustomer(
  customer
) {

  if (saveButton) {

    saveButton.disabled =
      true;

    saveButton.innerHTML =
      "⏳ ĐANG LƯU...";

  }


  try {

    // Kiểm tra trùng số điện thoại

    const {
      data: existing,
      error: checkError
    } =
      await supabaseClient
        .from("customers")
        .select("id")
        .eq(
          "phone",
          customer.phone
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
        "⚠️ Số điện thoại này đã tồn tại!"
      );

      return;

    }


    // INSERT

    const {
      data,
      error
    } =
      await supabaseClient
        .from("customers")
        .insert([
          customer
        ])
        .select();


    if (error) {

      throw error;

    }


    console.log(
      "Đã thêm:",
      data
    );


    alert(
      "✅ Đã thêm khách hàng thành công!"
    );


    resetForm();


    // Tự động tìm khách vừa thêm

    if (searchInput) {

      searchInput.value =
        customer.phone;

      await searchCustomers();

    }

  }

  catch (error) {

    console.error(
      "INSERT ERROR:",
      error
    );


    alert(
      "❌ Không thể lưu.\n\n" +
      error.message
    );

  }

  finally {

    if (saveButton) {

      saveButton.disabled =
        false;

      saveButton.innerHTML =
        "💾 LƯU KHÁCH HÀNG";

    }

  }

}


// ============================================================
// EDIT CUSTOMER
// ============================================================

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


    const fields = {

      phone:
        data.phone || "",

      customer_name:
        data.customer_name || "",

      shipper_name:
        data.shipper_name || "",

      installer_name:
        data.installer_name || "",

      hamlet:
        data.hamlet || "",

      commune:
        data.commune || "",

      address:
        data.address || "",

      note:
        data.note || ""

    };


    Object.keys(fields)
      .forEach(
        key => {

          const element =
            $(key);

          if (element) {

            element.value =
              fields[key];

          }

        }
      );


    if (customerForm) {

      customerForm.dataset.editId =
        id;

    }


    if (saveButton) {

      saveButton.innerHTML =
        "🔄 CẬP NHẬT KHÁCH HÀNG";

    }


    customerForm.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

  catch (error) {

    console.error(
      "EDIT ERROR:",
      error
    );


    alert(
      "❌ Không thể lấy dữ liệu.\n\n" +
      error.message
    );

  }

}


// ============================================================
// UPDATE CUSTOMER
// ============================================================

async function updateCustomer(
  id,
  customer
) {

  if (saveButton) {

    saveButton.disabled =
      true;

    saveButton.innerHTML =
      "⏳ ĐANG CẬP NHẬT...";

  }


  try {

    // Kiểm tra trùng

    const {
      data: duplicate,
      error: duplicateError
    } =
      await supabaseClient
        .from("customers")
        .select("id")
        .eq(
          "phone",
          customer.phone
        )
        .neq(
          "id",
          id
        )
        .limit(1);


    if (duplicateError) {

      throw duplicateError;

    }


    if (
      duplicate &&
      duplicate.length > 0
    ) {

      alert(
        "⚠️ Số điện thoại này đã thuộc khách hàng khác."
      );

      return;

    }


    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .update({

          phone:
            customer.phone,

          customer_name:
            customer.customer_name,

          shipper_name:
            customer.shipper_name,

          installer_name:
            customer.installer_name,

          hamlet:
            customer.hamlet,

          commune:
            customer.commune,

          address:
            customer.address,

          note:
            customer.note

        })
        .eq(
          "id",
          id
        );


    if (error) {

      throw error;

    }


    alert(
      "✅ Đã cập nhật khách hàng!"
    );


    resetForm();


    if (searchInput) {

      searchInput.value =
        customer.phone;

      await searchCustomers();

    }

  }

  catch (error) {

    console.error(
      "UPDATE ERROR:",
      error
    );


    alert(
      "❌ Không thể cập nhật.\n\n" +
      error.message
    );

  }

  finally {

    if (saveButton) {

      saveButton.disabled =
        false;

      saveButton.innerHTML =
        "💾 LƯU KHÁCH HÀNG";

    }

  }

}


// ============================================================
// DELETE CUSTOMER
// ============================================================

async function deleteCustomer(id) {

  const confirmDelete =
    confirm(
      "⚠️ Bạn có chắc muốn xóa khách hàng này?\n\n" +
      "Dữ liệu sẽ bị xóa khỏi database."
    );


  if (!confirmDelete) {

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
      "✅ Đã xóa khách hàng!"
    );


    await searchCustomers();

  }

  catch (error) {

    console.error(
      "DELETE ERROR:",
      error
    );


    alert(
      "❌ Không thể xóa.\n\n" +
      error.message
    );

  }

}


// ============================================================
// SEARCH BUTTON
// ============================================================

if (searchButton) {

  searchButton.addEventListener(
    "click",
    searchCustomers
  );

}


// ============================================================
// ENTER SEARCH
// ============================================================

if (searchInput) {

  searchInput.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        searchCustomers();

      }

    }
  );


  searchInput.addEventListener(
    "input",
    function() {

      this.value =
        cleanPhone(
          this.value
        );

    }
  );

}


// ============================================================
// CLEAR SEARCH
// ============================================================

if (clearSearch) {

  clearSearch.addEventListener(
    "click",
    function() {

      if (searchInput) {

        searchInput.value =
          "";

        searchInput.focus();

      }


      if (resultCount) {

        resultCount.textContent =
          "0 kết quả";

      }


      showEmpty(
        "Chưa có kết quả",
        "Nhập số điện thoại phía trên để bắt đầu tra cứu."
      );

    }
  );

}


// ============================================================
// PHONE INPUT
// ============================================================

const phoneInput =
  $("phone");


if (phoneInput) {

  phoneInput.addEventListener(
    "input",
    function() {

      this.value =
        cleanPhone(
          this.value
        );

    }
  );

}


// ============================================================
// TEST DATABASE
// ============================================================

async function testDatabase() {

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
        "❌ Database:",
        error
      );

      return false;

    }


    console.log(
      "✅ JT DATABASE OK"
    );


    return true;

  }

  catch (error) {

    console.error(
      "❌ Database connection:",
      error
    );

    return false;

  }

}


// ============================================================
// START
// ============================================================

console.log(
  "🚚 JT SHIPPER READY"
);


testDatabase();


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

// Cho HTML onclick gọi được

window.searchCustomers =
  searchCustomers;

window.editCustomer =
  editCustomer;

window.deleteCustomer =
  deleteCustomer;

window.resetForm =
  resetForm;
