/**
 * @Author: Anonystick
 * @Date: 2024-01-01 11:23:23
 * @LastEditors: Anonystick
 * @LastEditTime: 2024-01-21 11:24:32
 * @FilePath: /src/loggers/mylogger.js
 * Description
 * Copyright 2024 Anonystick , all
 * 2023-01-32 11:23:55
 */

"use-strict";
const path = require("path");
const { env } = require("#configs/constants.config");
const { createLogger, format, transports, info } = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");

class MyLogger {
    static DEFAULT_SCOPE = "app";

    constructor() {
        const formatPrint = format.printf(
            ({
                path,
                level,
                message,
                context,
                traceId,
                timestamp,
                metadata,
            }) => {
                return `${timestamp}::${level}::[${path}]::${traceId}::${message}::${context}::${JSON.stringify(
                    metadata
                )}`;
            }
        );

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: "src/logs",
                    level: "info",
                    filename: "application-%DATE%.info.log",
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                    format: format.combine(
                        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        formatPrint
                    ),
                }),
                new transports.DailyRotateFile({
                    dirname: "src/logs",
                    level: "error",
                    filename: "application-%DATE%.error.log",
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                    format: format.combine(
                        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        formatPrint
                    ),
                }),
            ],
        });
    }

    static parsePathToScope(filepath) {
        if (filepath.indexOf(path.sep) >= 0) {
            filepath = filepath.replace(process.cwd(), "");
        }
        return filepath;
    }

    commonParams(params) {
        let context, req, metadata, path;
        if (!Array.isArray(params)) {
            context = params;
        } else {
            [path, context, req, metadata] = params;
        }

        const traceId = req?.traceId || uuidv4();
        path = path.trim().replace(process.cwd(), "");
        return {
            path,
            traceId,
            context,
            metadata,
        };
    }

    log(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign(
            {
                message,
            },
            paramLog
        );
        this.logger.info(logObject);
    }

    error(message, params) {
        const paramLog = this.commonParams(params);

        const logObject = Object.assign(
            {
                message,
            },
            paramLog
        );

        this.logger.error(logObject);
    }
}

module.exports = new MyLogger();
