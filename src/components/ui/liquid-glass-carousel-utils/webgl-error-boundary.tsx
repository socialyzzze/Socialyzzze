import * as React from "react";
import { cn } from "@/lib/utils";

export interface WebGLErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

export class WebGLErrorBoundary extends React.Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("WebGL Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <WebGLFallback />;
    }
    return this.props.children;
  }
}

export interface WebGLFallbackProps {
  className?: string;
  message?: string;
}

export function WebGLFallback({ className, message }: WebGLFallbackProps) {
  return (
    <div
      className={cn(
        "flex h-64 w-full items-center justify-center rounded-md bg-dark-card border border-border p-6 text-center text-muted-foreground",
        className,
      )}
    >
      <p className="text-sm">
        {message || "Interactive gallery fallback active."}
      </p>
    </div>
  );
}
