<template>
  <div>
    <div
      v-for="(token, index) in tokens"
      :key="index"
      class="voucher-card"
      ref="vouchers"
    >
      <div class="voucher-content" :style="getVoucherStyle(index)">
        <img :src="getQrCodeUrl(token)" alt="QR Code" class="qr-code" />
        <div class="discount-info">
          <h2>SAVE {{ getDiscount(index) }}% OFF</h2>
          <p class="sale-type">{{ getSaleType(index) }}</p>
        </div>
      </div>
      <button @click="downloadVoucherAsPDF(index)">Download PDF</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const tokens = ref(["token1", "token2", "token3", "token4"]);
const vouchers = ref<HTMLDivElement[]>([]);

const getQrCodeUrl = (token: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(token)}`;
};

const getDiscount = (index: number): number => {
  return index % 2 === 0 ? 50 : 75;
};

const getSaleType = (index: number): string => {
  return index % 2 === 0 ? "BIG SALE" : "SUPER SALE";
};

const getVoucherStyle = (index: number): object => {
  return {
    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#f5a623",
    color: index % 2 === 0 ? "#000" : "#fff",
  };
};

const downloadVoucherAsPDF = async (index: number) => {
  const voucherElement = vouchers.value[index];
  if (!voucherElement) return;

  const canvas = await html2canvas(voucherElement);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [voucherElement.clientWidth, voucherElement.clientHeight],
  });

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    voucherElement.clientWidth,
    voucherElement.clientHeight
  );
  pdf.save(`voucher-${tokens.value[index]}.pdf`);
};

onMounted(() => {
  vouchers.value = document.querySelectorAll(".voucher-card");
});
</script>

<style scoped>
.voucher-card {
  width: 300px;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.voucher-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 10px;
}

.qr-code {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
}

.discount-info h2 {
  font-size: 24px;
  margin: 0;
}

.sale-type {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
