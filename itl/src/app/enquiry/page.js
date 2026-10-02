import EnquiryForm from "../../components/EnquiryForm";

export const metadata = {
  title: "Request a quotation",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnquiryPage() {
  return <EnquiryForm />;
}
