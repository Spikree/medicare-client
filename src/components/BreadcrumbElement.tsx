import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbItems {
  name: string;
  link: string;
}

type Props = {
  items?: BreadcrumbItems[];
  currentPage: string;
};

const BreadcrumbElement = ({ currentPage }: Props) => {
  const user_role = localStorage.getItem("user_role");

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {user_role === "doctor" ? (
            <BreadcrumbLink href="#" onClick={handleBackClick}>
              Dashboard
            </BreadcrumbLink>
          ) : (
            <BreadcrumbLink href="#" onClick={handleBackClick}>
              Home
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbElement;
