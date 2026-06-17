#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate expanded activation function course for crashAI.
Uses \u201C/\u201D for Chinese quotes (not ASCII ").
"""

import json

course = {
    "slug": "activation",
    "title": "03. \u6fc0\u6d3b\u51fd\u6570",
    "description": "Sigmoid/Tanh/ReLU/GELU/Softmax\uff1a\u6fc0\u6d3b\u51fd\u6570\u5168\u9762\u8be6\u89e3\uff0c\u6bcf\u5c42\u7684\u975e\u7ebf\u6027\u53d8\u6362",
    "category": "llm",
    "phase": "A",
    "order": 3,
    "sections": [
        # ============================================================
        # SECTION 1: WHY ACTIVATION FUNCTIONS
        # ============================================================
        {
            "type": "text",
            "title": "\u4e3a\u4ec0\u4e48\u9700\u8981\u6fc0\u6d3b\u51fd\u6570\uff1f",
            "content": (
                "<p>\u795e\u7ecf\u7f51\u7edc\u7684\u6bcf\u4e00\u5c42\u672c\u8d28\u4e0a\u662f\u4e00\u4e2a\u7ebf\u6027\u53d8\u6362\uff1az = Wx + b\u3002"
                "\u5982\u679c\u53ea\u6709\u7ebf\u6027\u53d8\u6362\uff0c\u90a3\u4e48\u65e0\u8bba\u5806\u591a\u5c11\u5c42\uff0c\u6574\u4e2a\u7f51\u7edc\u4ecd\u7136\u662f\u4e00\u4e2a\u7ebf\u6027\u51fd\u6570\u2014\u2014"
                "\u8fd9\u5c31\u50cf\u628a\u591a\u4e2a\u76f4\u7ebf\u53e0\u52a0\u5728\u4e00\u8d77\uff0c\u7ed3\u679c\u8fd8\u662f\u4e00\u6761\u76f4\u7ebf\u3002</p>"
                "<p><b>\u4e00\u4e2a\u7b80\u5355\u7684\u6570\u5b66\u4e8b\u5b9e\uff1a</b></p>"
                "<pre>\u65e0\u6fc0\u6d3b\u51fd\u6570\u7684\u4e24\u5c42\u7f51\u7edc\uff1a\ny = W\u2082(W\u2081x + b\u2081) + b\u2082\n  = (W\u2082W\u2081)x + (W\u2082b\u2081 + b\u2082)\n  = W'x + b'\n\u4ecd\u7136\u662f\u7ebf\u6027\u53d8\u6362\uff01</pre>"
                "<p><b>\u751f\u6d3b\u6bd4\u55bb\uff1a\u4e3a\u4ec0\u4e48\u4e16\u754c\u4e0d\u662f\u76f4\u7ebf\uff1f</b></p>"
                "<p>\u60f3\u8c61\u4e00\u4e2a\u53ea\u80fd\u505a\u52a0\u6cd5\u7684\u552f\u4e00\u8ba1\u7b97\u5668\u3002\u4f60\u7ed9\u5b83 2\uFF0C\u5b83\u56de\u7b54 4\uff1b"
                "\u7ed9 5\uFF0C\u56de\u7b54 10\u3002\u8fd9\u5c31\u662f\u7ebf\u6027\u2014\u2014\u8f93\u5165\u548c\u8f93\u51fa\u662f\u7b80\u5355\u7684\u6b63\u6bd4\u4f8b\u5173\u7cfb\u3002"
                "\u4f46\u73b0\u5b9e\u4e16\u754c\u7684\u95ee\u9898\uFF08\u56fe\u7247\u5206\u7c7b\u3001\u8bed\u97f3\u8bc6\u522b\u3001\u81ea\u7136\u8bed\u8a00\u7406\u89e3\uff09"
                "\u7edd\u5bf9\u4e0d\u662f\u7b80\u5355\u7684\u6b63\u6bd4\u4f8b\u5173\u7cfb\u3002</p>"
                "<p><b>\u6fc0\u6d3b\u51fd\u6570\u7684\u4f5c\u7528\uff1a</b></p>"
                "<ul>"
                "<li><b>\u5f15\u5165\u975e\u7ebf\u6027\uff1a</b>\u8ba9\u7f51\u7edc\u80fd\u5b66\u4e60\u590d\u6742\u7684\u66f2\u7ebf\u548c\u6a21\u5f0f</li>"
                "<li><b>\u4fdd\u6301\u8f93\u51fa\u8303\u56f4\u53ef\u63a7\uff1a</b>\u9632\u6b62\u6570\u503c\u7206\u70b8\u6216\u8fc7\u5c0f</li>"
                "<li><b>\u63d0\u4f9b\u6e90\u6c60\u5ea6\uff1a</b>\u6bcf\u4e2a\u6fc0\u6d3b\u51fd\u6570\u90fd\u6709\u53ef\u5bfc\u7684\u5f62\u5f0f\uff0c\u652f\u6301\u53cd\u5411\u4f20\u64ad</li>"
                "</ul>"
                "<p>\u8fd9\u4e00\u7ae0\u6211\u4eec\u5c06\u8be6\u7ec6\u5b66\u4e60 5 \u79cd\u6700\u5e38\u7528\u7684\u6fc0\u6d3b\u51fd\u6570\uff1a"
                "<b>Sigmoid\u3001Tanh\u3001ReLU\u3001GELU\u3001Softmax</b>\u3002</p>"
            )
        },

        # ============================================================
        # SECTION 2: SIGMOID
        # ============================================================
        {
            "type": "text",
            "title": "Sigmoid \u6fc0\u6d3b\u51fd\u6570",
            "content": (
                "<p><b>Sigmoid</b>\u662f\u6700\u65e9\u671f\u7684\u6fc0\u6d3b\u51fd\u6570\u4e4b\u4e00\uff0c"
                "\u5b83\u7684\u8f93\u51fa\u8303\u56f4\u662f (0, 1)\uff0c"
                "\u53ef\u4ee5\u7406\u89e3\u4e3a\u201c\u5f00\u5173\u7684\u221e\u6ed1\u7248\u201d\u2014\u2014"
                "\u4e0d\u662f\u7c97\u7cd9\u7684 0/1 \u5f00\u5173\uff0c\u800c\u662f\u4ece 0 \u5230 1 \u7684\u6e10\u53d8\u3002</p>"
                "<p><b>\u751f\u6d3b\u6bd4\u55bb\uff1a\u5149\u7ebf\u8c03\u5149\u5668</b></p>"
                "<p>\u60f3\u8c61\u4e00\u4e2a\u8c03\u5149\u5668\u2014\u2014\u4f60\u4e0d\u662f\u53ea\u80fd\u5f00\u6216\u5173\u706f\uff0c"
                "\u800c\u662f\u53ef\u4ee5\u7f13\u6162\u65cb\u8f6c\u626d\u626d\u6765\u8c03\u8282\u4eae\u5ea6\u3002"
                "\u5f53\u8f93\u5165\u503c\u5f88\u5927\u65f6\uff08\u5927\u529b\u65cb\u626d\uff09\uff0c"
                "\u706f\u5149\u8fbe\u5230\u6700\u4eae\uff081\uff09\uff1b"
                "\u8f93\u5165\u503c\u5f88\u5c0f\u65f6\uff08\u53cd\u5411\u65cb\u626d\uff09\uff0c\u706f\u5149\u5b8c\u5168\u7184\u706d\uff080\uff09\uff1b"
                "\u5728\u4e2d\u95f4\u533a\u57df\uff08\u8f93\u5165\u63a5\u8fd1 0\uff09\uff0c\u5c0f\u5e45\u5ea6\u65cb\u8f6c\u4f1a\u4ea7\u751f\u663e\u8457\u53d8\u5316\u3002</p>"
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>\u03c3(x) = 1 / (1 + e^{-x})</pre>"
                "<p><b>\u5bfc\u6570\uff08\u8bb0\u4f4f\u8fd9\u4e2a\uff0c\u53cd\u5411\u4f20\u64ad\u4f1a\u7528\uff09\uff1a</b></p>"
                "<pre>\u03c3'(x) = \u03c3(x) \u00d7 (1 - \u03c3(x))</pre>"
                "<p>Sigmoid \u7684\u5bfc\u6570\u80fd\u7528\u8f93\u51fa\u503c\u672c\u8eab\u8868\u793a\uff0c"
                "\u8fd9\u662f\u5b83\u7684\u4e00\u5927\u4fbf\u5229\u4e4b\u5904\u3002</p>"
                "<p><b>\u4f18\u7f3a\u70b9\uff1a</b></p>"
                "<ul>"
                "<li>\u2714 \u8f93\u51fa\u5728 (0,1)\uff0c\u53ef\u4f5c\u6982\u7387\u89e3\u91ca</li>"
                "<li>\u2714 \u5e73\u6ed1\u53ef\u5bfc\uff0c\u5bfc\u6570\u8ba1\u7b97\u7b80\u5355</li>"
                "<li>\u2718 \u68af\u5ea6\u6d88\u5931\uff08\u4e24\u7aef\u5bfc\u6570\u8d8b\u8fd1 0\uff09</li>"
                "<li>\u2718 \u8f93\u51fa\u4e0d\u662f\u96f6\u4e2d\u5fc3\u7684\uff08\u6240\u6709\u8f93\u51fa >0\uff09\u2192 \u4e0a\u4e00\u5c42\u68af\u5ea6\u5168\u90e8\u6b63\u6216\u5168\u90e8\u8d1f</li>"
                "<li>\u2718 \u6307\u6570\u8ba1\u7b97\u6d88\u8017\u8f83\u5927</li>"
                "</ul>"
            )
        },
        {
            "type": "formula",
            "title": "Sigmoid \u516c\u5f0f\u4e0e\u53c2\u6570",
            "content": (
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>\u03c3(x) = 1 / (1 + e^{-x})</pre>"
                "<pre>\u03c3'(x) = \u03c3(x)(1 - \u03c3(x))</pre>"
                "<p><b>\u53c2\u6570\u8868\uff1a</b></p>"
                "<table>"
                "<tr><th>\u53c2\u6570</th><th>\u503c</th><th>\u8bf4\u660e</th></tr>"
                "<tr><td>\u8f93\u5165\u8303\u56f4</td><td>(-\u221e, +\u221e)</td><td>\u4efb\u610f\u5b9e\u6570</td></tr>"
                "<tr><td>\u8f93\u51fa\u8303\u56f4</td><td>(0, 1)</td><td>\u975e\u8d1f\uff0c\u5c0f\u4e8e1</td></tr>"
                "<tr><td>f(0)</td><td>0.5</td><td>\u539f\u70b9\u5904\u4e2d\u95f4\u503c</td></tr>"
                "<tr><td>\u6700\u5927\u5bfc\u6570</td><td>0.25 (x=0\u65f6)</td><td>\u539f\u70b9\u5904\u53d8\u5316\u6700\u5927</td></tr>"
                "<tr><td>f(5)</td><td>\u2248 0.9933</td><td>\u6b63\u65b9\u5411\u8d8b\u4e8e\u9971\u548c</td></tr>"
                "<tr><td>f(-5)</td><td>\u2248 0.0067</td><td>\u8d1f\u65b9\u5411\u8d8b\u4e8e\u9971\u548c</td></tr>"
                "</table>"
                "<p><b>\u6b65\u9aa4\u5316\u63a8\u5bfc\u8fc7\u7a0b\uff1a</b></p>"
                "<ol>"
                "<li>\u03c3(x) = (1 + e^{-x})^{-1}</li>"
                "<li>\u8bbegu = 1 + e^{-x}\uff0c\u5219\u03c3 = u^{-1}</li>"
                "<li>d\u03c3/du = -u^{-2} = -(1 + e^{-x})^{-2}</li>"
                "<li>du/dx = -e^{-x}</li>"
                "<li>\u94fe\u5f0f\u6cd5\u5219\uff1a\u03c3'(x) = -(1 + e^{-x})^{-2} \u00d7 (-e^{-x}) = e^{-x} / (1 + e^{-x})^2</li>"
                "<li>\u5316\u7b80\uff1a\u03c3'(x) = [1/(1+e^{-x})] \u00d7 [e^{-x}/(1+e^{-x})] = \u03c3(x) \u00d7 (1 - \u03c3(x)) \u2713</li>"
                "</ol>"
            )
        },
        {
            "type": "example",
            "title": "Sigmoid \u6570\u503c\u4f8b\u5b50",
            "content": (
                "<p>\u7ed9\u5b9a\u8f93\u5165 x = [-3, -1, 0, 1, 3]\uff0c\u8ba1\u7b97\u6bcf\u4e2a\u70b9\u7684 Sigmoid \u503c\u548c\u5bfc\u6570\u3002</p>"
                "<p><b>\u6b65\u9aa4 1\uff1a\u8ba1\u7b97\u6307\u6570\u90e8\u5206</b></p>"
                "<table>"
                "<tr><th>x</th><th>e^{-x}</th><th>1 + e^{-x}</th><th>\u03c3(x)</th><th>\u03c3'(x)</th></tr>"
                "<tr><td>-3</td><td>e^{3} \u2248 20.0855</td><td>21.0855</td><td>0.0474</td><td>0.0452</td></tr>"
                "<tr><td>-1</td><td>e^{1} \u2248 2.7183</td><td>3.7183</td><td>0.2689</td><td>0.1966</td></tr>"
                "<tr><td>0</td><td>e^{0} = 1.0000</td><td>2.0000</td><td>0.5000</td><td>0.2500</td></tr>"
                "<tr><td>1</td><td>e^{-1} \u2248 0.3679</td><td>1.3679</td><td>0.7311</td><td>0.1966</td></tr>"
                "<tr><td>3</td><td>e^{-3} \u2248 0.0498</td><td>1.0498</td><td>0.9526</td><td>0.0452</td></tr>"
                "</table>"
                "<p><b>\u6b65\u9aa4 2\uff1a\u9a8c\u8bc1\u5bfc\u6570\u516c\u5f0f</b></p>"
                "<p>\u4ee5 x=0 \u4e3a\u4f8b\uff1a</p>"
                "<pre>\u03c3(0) = 0.5\n\u03c3'(0) = 0.5 \u00d7 (1 - 0.5) = 0.5 \u00d7 0.5 = 0.25 \u2713</pre>"
                "<p><b>\u89c2\u5bdf\uff1a</b></p>"
                "<ul>"
                "<li>x=0 \u65f6\u5bfc\u6570\u6700\u5927 (0.25)\uff0c\u53d8\u5316\u6700\u654f\u611f</li>"
                "<li>x=\u00b13 \u65f6\u5bfc\u6570\u5df2\u7ecf\u5f88\u5c0f (0.045)\uff0c\u8fdb\u5165\u9971\u548c\u533a</li>"
                "<li>x=\u00b15 \u65f6\u5bfc\u6570\u2248 0.0067\uff0c\u57fa\u672c\u201c\u6b7b\u4ea1\u201d\u2014\u2014\u68af\u5ea6\u6d88\u5931</li>"
                "</ul>"
                "<p><b>\u751f\u6d3b\u6bd4\u55bb\u8865\u5145\uff1a</b></p>"
                "<p>\u8c03\u5149\u5668\u5728\u6700\u6697\u548c\u6700\u4eae\u7684\u4e24\u7aef\u65f6\uff0c"
                "\u4f60\u5c0f\u5e45\u65cb\u8f6c\u57fa\u672c\u770b\u4e0d\u51fa\u53d8\u5316\uff1b"
                "\u4f46\u5728\u4e2d\u95f4\u4f4d\u7f6e\uff08\u706f\u5149\u4e00\u534a\u4eae\uff09\u65f6\uff0c"
                "\u7a0d\u5fae\u65cb\u52a8\u5c31\u80fd\u770b\u5230\u663e\u8457\u53d8\u5316\u3002"
                "\u8fd9\u5c31\u662f\u201c\u4e2d\u95f4\u533a\u57df\u654f\u611f\u201d\u7684\u76f4\u89c9\u3002</p>"
            )
        },
        {
            "type": "exercise",
            "title": "Sigmoid \u7ec3\u4e60",
            "content": (
                "<p><b>Q1\uff1a</b>\u8ba1\u7b97 x = 2 \u65f6 Sigmoid \u7684\u503c\u548c\u5bfc\u6570\u3002</p>"
                "<p><b>Q2\uff1a</b>\u4e3a\u4ec0\u4e48 Sigmoid \u5bfc\u6570\u6700\u5927\u503c\u662f 0.25\uff1f\u8bf7\u63a8\u5bfc\u8bc1\u660e\u3002</p>"
                "<p><b>Q3\uff1a</b>\u5982\u679c\u795e\u7ecf\u7f51\u7edc\u6240\u6709\u5c42\u90fd\u7528 Sigmoid\uff0c"
                "\u6df1\u5c42\u7f51\u7edc\u4f1a\u9047\u5230\u4ec0\u4e48\u95ee\u9898\uff1f\u8bf7\u7528\u6570\u5b66\u89e3\u91ca\u3002</p>"
                "<p><b>Q4\uff1a</b>\u8bbe\u8f93\u5165 x = [-10, -0.5, 0, 0.5, 10]\uff0c"
                "\u5e76\u5217\u8868\u8ba1\u7b97\u6bcf\u4e2a\u70b9\u7684 Sigmoid \u503c\u3002"
                "\u54ea\u4e9b\u70b9\u5904\u4e8e\u9971\u548c\u533a\u57df\uff1f</p>"
                "<p><b>Q5\uff1a</b>Sigmoid \u7684\u8f93\u51fa\u8303\u56f4\u5728 (0,1)\uff0c"
                "\u5982\u679c\u6211\u4eec\u9700\u8981\u8f93\u51fa\u5728 (-1,1)\uff0c\u5e94\u8be5\u600e\u4e48\u505a\uff1f"
                "\uff08\u63d0\u793a\uff1a\u8fd9\u5c31\u662f Tanh\uff09</p>"
            ),
            "answer": (
                "<p><b>A1\uff1a</b></p>"
                "<pre>\u03c3(2) = 1 / (1 + e^{-2}) = 1 / (1 + 0.1353) = 0.8808\n\u03c3'(2) = 0.8808 \u00d7 (1 - 0.8808) = 0.8808 \u00d7 0.1192 = 0.1050</pre>"
                "<p><b>A2\uff1a</b></p>"
                "<p>\u8bbeg(x) = \u03c3(x)(1 - \u03c3(x)) = \u03c3(x) - \u03c3(x)^2\u3002"
                "\u5bf9 g \u6c42\u5bfc\uff1ag'(x) = \u03c3'(x) - 2\u03c3(x)\u03c3'(x) = \u03c3'(x)(1 - 2\u03c3(x))\u3002"
                "\u4ee4 g'(x) = 0\uff0c\u5f97\u03c3(x) = 0.5\uff0c\u5373 x = 0\u3002"
                "\u5e26\u5165\uff1amax(\u03c3'(x)) = 0.5 \u00d7 0.5 = 0.25\u3002</p>"
                "<p><b>A3\uff1a</b></p>"
                "<p>\u68af\u5ea6\u6d88\u5931\u95ee\u9898\u3002\u8bbe\u7f51\u7edc\u6709 L \u5c42\uff0c\u6bcf\u5c42\u5bfc\u6570\u6700\u5927\u4e3a 0.25\uff0c"
                "\u5219\u94fe\u5f0f\u6cd5\u5219\u4e0b\u68af\u5ea6 < 0.25^L\u3002"
                "\u5f53 L=10 \u65f6\uff0c0.25^{10} \u2248 9.5 \u00d7 10^{-7}\uff0c\u51e0\u4e4e\u4e3a\u96f6\uff0c\u4f7f\u5f97\u6df1\u5c42\u6743\u91cd\u65e0\u6cd5\u66f4\u65b0\u3002"
                "\u8fd9\u5c31\u662f\u4e3a\u4ec0\u4e48\u6df1\u5c42\u7f51\u7edc\u4e0d\u7528 Sigmoid\uff0c\u800c\u7528 ReLU\u3002</p>"
                "<p><b>A4\uff1a</b></p>"
                "<table>"
                "<tr><th>x</th><th>e^{-x}</th><th>\u03c3(x)</th><th>\u9971\u548c\uff1f</th></tr>"
                "<tr><td>-10</td><td>22026.4658</td><td>0.000045</td><td>\u2714 \u8d1f\u5411\u9971\u548c</td></tr>"
                "<tr><td>-0.5</td><td>1.6487</td><td>0.3775</td><td>\u2718 \u654f\u611f\u533a</td></tr>"
                "<tr><td>0</td><td>1.0000</td><td>0.5000</td><td>\u2718 \u654f\u611f\u533a</td></tr>"
                "<tr><td>0.5</td><td>0.6065</td><td>0.6225</td><td>\u2718 \u654f\u611f\u533a</td></tr>"
                "<tr><td>10</td><td>0.000045</td><td>0.999955</td><td>\u2714 \u6b63\u5411\u9971\u548c</td></tr>"
                "</table>"
                "<p>\u53ea\u6709 |x| \u5927\u4e8e\u7ea6 5 \u65f6\u624d\u8fdb\u5165\u9971\u548c\u533a\u57df\u3002</p>"
                "<p><b>A5\uff1a</b></p>"
                "<p>\u5bf9 Sigmoid \u505a\u7ebf\u6027\u53d8\u6362\uff1a</p>"
                "<pre>Tanh(x) = 2 \u00d7 \u03c3(2x) - 1</pre>"
                "<p>\u8fd9\u4f1a\u5c06\u8f93\u51fa\u8303\u56f4\u4ece (0,1) \u6620\u5c04\u5230 (-1,1)\u3002"
                "\u4e0b\u4e00\u8282\u6211\u4eec\u5c31\u5b66\u4e60 Tanh\u3002</p>"
            )
        },

        # ============================================================
        # SECTION 3: TANH
        # ============================================================
        {
            "type": "text",
            "title": "Tanh \u6fc0\u6d3b\u51fd\u6570",
            "content": (
                "<p><b>Tanh\uff08\u53cc\u66f2\u6b63\u5207\uff09</b>\u662f Sigmoid \u7684\u201c\u5347\u7ea7\u7248\u201d\u3002"
                "\u5b83\u7684\u8f93\u51fa\u8303\u56f4\u662f (-1, 1)\uff0c\u4e2d\u5fc3\u4e3a 0\u3002"
                "\u8fd9\u610f\u5473\u7740\u5b83\u7684\u8f93\u51fa\u53ef\u4ee5\u662f\u8d1f\u6570\uff0c"
                "\u8fd9\u5bf9\u4e8e\u4e0b\u4e00\u5c42\u7684\u5b66\u4e60\u975e\u5e38\u91cd\u8981\u3002</p>"
                "<p><b>\u751f\u6d3b\u6bd4\u55bb\uff1a\u79cb\u5343</b></p>"
                "<p>\u79cb\u5343\u4ece\u6700\u9ad8\u70b9\u524d\u65b9 (+1) \u7ecf\u8fc7\u5e95\u90e8 (0) \u5230\u6700\u9ad8\u70b9\u540e\u65b9 (-1)\u3002"
                "\u5b83\u662f\u5bf9\u79f0\u7684\uff0c\u80fd\u6b63\u80fd\u8d1f\u3002"
                "\u8fd9\u5c31\u662f\u201c\u96f6\u4e2d\u5fc3\u201d\u7684\u76f4\u89c9\u2014\u2014\u8f93\u51fa\u5305\u542b\u6b63\u8d1f\u4fe1\u53f7\u3002</p>"
                "<p><b>\u4e3a\u4ec0\u4e48\u96f6\u4e2d\u5fc3\u91cd\u8981\uff1f</b></p>"
                "<p>\u5982\u679c\u6240\u6709\u8f93\u51fa\u90fd\u662f\u6b63\u6570\uff08\u5982 Sigmoid\uff09\uff0c"
                "\u90a3\u4e48\u4e0a\u4e00\u5c42\u7684\u68af\u5ea6\u5168\u90e8\u6b63\u6216\u5168\u90e8\u8d1f\uff0c"
                "\u5bfc\u81f4\u6743\u91cd\u53ea\u80fd\u5f80\u540c\u4e00\u4e2a\u65b9\u5411\u66f4\u65b0\uff0c\u6536\u655b\u6162\u3002"
                "Tanh \u7684\u96f6\u4e2d\u5fc3\u7279\u6027\u89e3\u51b3\u4e86\u8fd9\u4e2a\u95ee\u9898\u3002</p>"
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>tanh(x) = (e^x - e^{-x}) / (e^x + e^{-x})</pre>"
                "<p><b>\u5bfc\u6570\uff1a</b></p>"
                "<pre>tanh'(x) = 1 - tanh(x)^2</pre>"
                "<p><b>\u4f18\u7f3a\u70b9\uff1a</b></p>"
                "<ul>"
                "<li>\u2714 \u96f6\u4e2d\u5fc3\uff0c\u6536\u655b\u901f\u5ea6\u901a\u5e38\u5feb\u4e8e Sigmoid</li>"
                "<li>\u2714 \u5bfc\u6570\u8ba1\u7b97\u7b80\u5355</li>"
                "<li>\u2718 \u4ecd\u7136\u5b58\u5728\u68af\u5ea6\u6d88\u5931\u95ee\u9898\uff08\u4e24\u7aef\u5bfc\u6570\u8d8b\u8fd1 0\uff09</li>"
                "<li>\u2718 \u6307\u6570\u8ba1\u7b97\u6d88\u8017\u5927</li>"
                "</ul>"
            )
        },
        {
            "type": "formula",
            "title": "Tanh \u516c\u5f0f\u4e0e\u53c2\u6570",
            "content": (
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>tanh(x) = (e^x - e^{-x}) / (e^x + e^{-x})</pre>"
                "<pre>tanh(x) = (1 - e^{-2x}) / (1 + e^{-2x})</pre>"
                "<pre>tanh'(x) = 1 - tanh(x)^2 = sech(x)^2</pre>"
                "<p><b>\u53c2\u6570\u8868\uff1a</b></p>"
                "<table>"
                "<tr><th>\u53c2\u6570</th><th>\u503c</th><th>\u8bf4\u660e</th></tr>"
                "<tr><td>\u8f93\u5165\u8303\u56f4</td><td>(-\u221e, +\u221e)</td><td>\u4efb\u610f\u5b9e\u6570</td></tr>"
                "<tr><td>\u8f93\u51fa\u8303\u56f4</td><td>(-1, 1)</td><td>\u96f6\u4e2d\u5fc3</td></tr>"
                "<tr><td>f(0)</td><td>0</td><td>\u539f\u70b9\u5904\u4e3a 0</td></tr>"
                "<tr><td>\u6700\u5927\u5bfc\u6570</td><td>1 (x=0\u65f6)</td><td>\u6bd4 Sigmoid (0.25) \u5927 4 \u500d</td></tr>"
                "<tr><td>f(2)</td><td>\u2248 0.9640</td><td>\u8d8b\u4e8e\u6b63\u5411\u9971\u548c</td></tr>"
                "<tr><td>f(-2)</td><td>\u2248 -0.9640</td><td>\u8d8b\u4e8e\u8d1f\u5411\u9971\u548c</td></tr>"
                "</table>"
                "<p><b>\u6b65\u9aa4\u5316\u63a8\u5bfc\u8fc7\u7a0b\uff08\u5bfc\u6570\uff09\uff1a</b></p>"
                "<ol>"
                "<li>tanh(x) = (e^x - e^{-x}) / (e^x + e^{-x})</li>"
                "<li>\u8bbeu = e^x - e^{-x}, v = e^x + e^{-x}\uff0c\u6cd5\u5219\uff1a(u/v)' = (u'v - uv')/v^2</li>"
                "<li>u' = e^x + e^{-x} = v</li>"
                "<li>v' = e^x - e^{-x} = u</li>"
                "<li>tanh'(x) = (v\u00b7v - u\u00b7u) / v^2 = (v^2 - u^2) / v^2 = 1 - (u/v)^2 = 1 - tanh(x)^2 \u2713</li>"
                "</ol>"
            )
        },
        {
            "type": "example",
            "title": "Tanh \u6570\u503c\u4f8b\u5b50",
            "content": (
                "<p>\u7ed9\u5b9a\u8f93\u5165 x = [-3, -1, 0, 1, 3]\uff0c\u8ba1\u7b97 Tanh \u503c\u548c\u5bfc\u6570\u3002</p>"
                "<p><b>Step 1\uff1a\u8ba1\u7b97 e^x \u548c e^{-x}</b></p>"
                "<table>"
                "<tr><th>x</th><th>e^x</th><th>e^{-x}</th><th>e^x-e^{-x}</th><th>e^x+e^{-x}</th><th>tanh(x)</th><th>tanh'(x)</th></tr>"
                "<tr><td>-3</td><td>0.0498</td><td>20.0855</td><td>-20.0357</td><td>20.1353</td><td>-0.9951</td><td>0.0099</td></tr>"
                "<tr><td>-1</td><td>0.3679</td><td>2.7183</td><td>-2.3504</td><td>3.0862</td><td>-0.7616</td><td>0.4200</td></tr>"
                "<tr><td>0</td><td>1.0000</td><td>1.0000</td><td>0.0000</td><td>2.0000</td><td>0.0000</td><td>1.0000</td></tr>"
                "<tr><td>1</td><td>2.7183</td><td>0.3679</td><td>2.3504</td><td>3.0862</td><td>0.7616</td><td>0.4200</td></tr>"
                "<tr><td>3</td><td>20.0855</td><td>0.0498</td><td>20.0357</td><td>20.1353</td><td>0.9951</td><td>0.0099</td></tr>"
                "</table>"
                "<p><b>Step 2\uff1a\u9a8c\u8bc1\u5bfc\u6570\u516c\u5f0f</b></p>"
                "<p>\u4ee5 x=1 \u4e3a\u4f8b\uff1a</p>"
                "<pre>tanh(1) = 0.7616\ntanh'(1) = 1 - 0.7616^2 = 1 - 0.5800 = 0.4200 \u2713</pre>"
                "<p><b>\u5bf9\u6bd4 Sigmoid \u548c Tanh\uff1a</b></p>"
                "<table>"
                "<tr><th>\u6027\u8d28</th><th>Sigmoid</th><th>Tanh</th></tr>"
                "<tr><td>\u8f93\u51fa\u8303\u56f4</td><td>(0, 1)</td><td>(-1, 1)</td></tr>"
                "<tr><td>\u662f\u5426\u96f6\u4e2d\u5fc3</td><td>\u2718</td><td>\u2714</td></tr>"
                "<tr><td>\u6700\u5927\u5bfc\u6570</td><td>0.25</td><td>1.0</td></tr>"
                "<tr><td>\u6536\u655b\u901f\u5ea6</td><td>\u8f83\u6162</td><td>\u8f83\u5feb</td></tr>"
                "</table>"
                "<p>Tanh \u7684\u5bfc\u6570\u8303\u56f4\u66f4\u5927\uff08\u6700\u5927\u4e3a 1\uff09\uff0c"
                "\u8fd9\u610f\u5473\u7740\u68af\u5ea6\u66f4\u5f3a\uff0c\u57fa\u672c\u4e0a\u6240\u6709\u573a\u6668 Tanh \u90fd\u4f18\u4e8e Sigmoid\u3002</p>"
            )
        },
        {
            "type": "exercise",
            "title": "Tanh \u7ec3\u4e60",
            "content": (
                "<p><b>Q1\uff1a</b>\u8ba1\u7b97 x = 2 \u65f6 Tanh \u7684\u503c\u548c\u5bfc\u6570\u3002</p>"
                "<p><b>Q2\uff1a</b>\u7528 Sigmoid \u8868\u793a Tanh\uff1a\u8bc1\u660e tanh(x) = 2\u03c3(2x) - 1\u3002</p>"
                "<p><b>Q3\uff1a</b>\u4e3a\u4ec0\u4e48\u96f6\u4e2d\u5fc3\u7279\u6027\u80fd\u52a0\u901f\u6536\u655b\uff1f"
                "\u8bf7\u4ece\u68af\u5ea6\u66f4\u65b0\u89d2\u5ea6\u89e3\u91ca\u3002</p>"
                "<p><b>Q4\uff1a</b>\u5df2\u77e5\u795e\u7ecf\u7f51\u7edc\u4e2d\u4e00\u5c42\u7684\u8f93\u51fa\u5747\u503c\u4e3a 0.6\uff0c"
                "\u7528\u7684\u662f Sigmoid\u3002\u5982\u679c\u6362\u6210 Tanh\uff0c\u5bf9\u4e0b\u4e00\u5c42\u7684\u68af\u5ea6\u4f1a\u6709\u4ec0\u4e48\u5f71\u54cd\uff1f</p>"
                "<p><b>Q5\uff1a</b>\u7ed8\u5236 Sigmoid \u548c Tanh \u7684\u51fd\u6570\u56fe\u50cf\uff0c"
                "\u6807\u51fa\u5b83\u4eec\u7684\u5173\u952e\u5dee\u5f02\u70b9\u3002</p>"
            ),
            "answer": (
                "<p><b>A1\uff1a</b></p>"
                "<pre>e^2 = 7.3891, e^{-2} = 0.1353\ntanh(2) = (7.3891 - 0.1353) / (7.3891 + 0.1353) = 7.2538 / 7.5244 = 0.9640\ntanh'(2) = 1 - 0.9640^2 = 1 - 0.9293 = 0.0707</pre>"
                "<p><b>A2\uff1a</b></p>"
                "<pre>\u03c3(2x) = 1 / (1 + e^{-2x})\n2\u03c3(2x) - 1 = 2/(1+e^{-2x}) - 1 = (2 - (1+e^{-2x}))/(1+e^{-2x}) = (1-e^{-2x})/(1+e^{-2x}) = tanh(x) \u2713</pre>"
                "<p><b>A3\uff1a</b></p>"
                "<p>\u8bbeprevious layer output \u5747\u503c\u4e3a \u00b5\u3002"
                "\u82e5\u00b5 > 0\uff08\u5982 Sigmoid\uff09\uff0c\u5219\u68af\u5ea6\u66f4\u65b0 W = W - \u03b1\u00b7\u00b5\u00b7\u2207L"
                "\u2192 \u6240\u6709\u6743\u91cd\u540c\u65b9\u5411\u66f4\u65b0\uff0c\u9700\u8981\u201czigzag\u201d\u6536\u655b\u3002"
                "\u82e5\u00b5 \u2248 0\uff08Tanh\u96f6\u4e2d\u5fc3\uff09\uff0c\u5219\u68af\u5ea6\u66f4\u65b0\u65b9\u5411\u66f4\u591a\u6837\uff0c"
                "\u6536\u655b\u66f4\u5feb\u3002\u8fd9\u7c7b\u4f3c\u4e8ePCA\u767d\u5316\u7684\u6548\u679c\u3002</p>"
                "<p><b>A4\uff1a</b></p>"
                "<p>Sigmoid \u8f93\u51fa\u5747\u503c\u4e3a 0.6\uff0c"
                "\u90a3\u4e48\u6240\u6709\u68af\u5ea6\u90fd\u4e58\u4ee5\u4e86\u4e00\u4e2a\u504f\u79fb\u91cf\uff0c"
                "\u5bfc\u81f4\u4e0b\u4e00\u5c42\u6743\u91cd\u66f4\u65b0\u5728\u67d0\u4e2a\u65b9\u5411\u4e0a\u504f\u79fb\u3002"
                "\u6362\u6210 Tanh\uff08\u5747\u503c\u8d8b\u8fd1 0\uff09\u540e\uff0c\u68af\u5ea6\u5206\u5e03\u66f4\u5747\u5300\uff0c"
                "\u7c7b\u4f3c\u4e8e\u6570\u636e\u6807\u51c6\u5316\u7684\u6548\u679c\u3002</p>"
                "<p><b>A5\uff1a</b></p>"
                "<p>\u5173\u952e\u5dee\u5f02\u70b9\uff1a</p>"
                "<ul>"
                "<li>Tanh \u7ecf\u8fc7\u539f\u70b9 (0,0)\uff0cSigmoid \u7ecf\u8fc7 (0,0.5)</li>"
                "<li>Tanh \u5bf9\u79f0\uff0c\u503c\u57df (-1,1)\uff1bSigmoid \u975e\u5bf9\u79f0\uff0c\u503c\u57df (0,1)</li>"
                "<li>Tanh \u539f\u70b9\u5904\u659c\u7387\u66f4\u9661\uff081 vs 0.25\uff09</li>"
                "</ul>"
            )
        },

        # ============================================================
        # SECTION 4: RELU
        # ============================================================
        {
            "type": "text",
            "title": "ReLU \u6fc0\u6d3b\u51fd\u6570",
            "content": (
                "<p><b>ReLU\uff08\u4fee\u6b63\u7ebf\u6027\u5355\u5143\uff0cRectified Linear Unit\uff09</b>"
                "\u662f\u5f53\u524d\u6700\u5e38\u7528\u7684\u6fc0\u6d3b\u51fd\u6570\u3002"
                "\u5b83\u7684\u5f62\u5f0f\u6781\u5176\u7b80\u5355\uff1a"
                "\u6b63\u6570\u4fdd\u6301\u4e0d\u53d8\uff0c\u8d1f\u6570\u53d8\u4e3a 0\u3002</p>"
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>ReLU(x) = max(0, x)</pre>"
                "<p><b>\u5bfc\u6570\uff1a</b></p>"
                "<pre>ReLU'(x) = 1 \u5982\u679c x > 0, 0 \u5982\u679c x < 0\n\u5728 x = 0 \u5904\u4e0d\u53ef\u5bfc\uff08\u5b9e\u9645\u4f7f\u7528\u65f6\u5f53\u4f5c\u5bfc\u6570\u4e3a 1\uff09</pre>"
                "<p><b>\u751f\u6d3b\u6bd4\u55bb\uff1a\u8fc7\u6ee4\u5668\u7f51\u7edc\u3001\u6c34\u7ba1\u9632\u56de\u6d41\u9600</b></p>"
                "<p>\u60f3\u8c61\u4e00\u4e2a\u53ea\u5141\u8bb8\u6c34\u6d41\u5411\u4e00\u4e2a\u65b9\u5411\u7684\u9600\u95e8\u2014\u2014"
                "\u6b63\u5411\u6c34\u538b\u65f6\u6c34\u901a\u8fc7\uff1b\u53cd\u5411\u6c34\u538b\u65f6\u5b8c\u5168\u62e6\u622a\u3002"
                "\u8fd9\u5c31\u662f ReLU\uff1a\u6b63\u4fe1\u53f7\u76f4\u63a5\u901a\u8fc7\uff0c\u8d1f\u4fe1\u53f7\u88ab\u201c\u622a\u65ad\u201d\u3002</p>"
                "<p><b>\u4f18\u7f3a\u70b9\uff1a</b></p>"
                "<ul>"
                "<li>\u2714 \u8ba1\u7b97\u6781\u7b80\u5355\uff0c\u6bd4 Sigmoid/Tanh \u5feb\u591a\u4e86\uff08\u65e0\u6307\u6570\uff09</li>"
                "<li>\u2714 \u6b63\u533a\u95f4\u5bfc\u6570\u6052\u4e3a 1\uff0c\u65e0\u68af\u5ea6\u6d88\u5931\u95ee\u9898</li>"
                "<li>\u2714 \u52c7\u6562\u6027\u8d28\u4f7f\u5f97\u7f51\u7edc\u66f4\u7a00\u758f\uff08\u5927\u91cf\u795e\u7ecf\u5143\u8f93\u51fa\u4e3a 0\uff09</li>"
                "<li>\u2718 <b>Dead ReLU</b>\uff1a\u7f51\u7edc\u521d\u59cb\u5316\u4e0d\u597d\u6216\u5b66\u4e60\u7387\u8fc7\u5927\u65f6\uff0c"
                "\u90e8\u5206\u795e\u7ecf\u5143\u8f93\u5165\u59cb\u7ec8 < 0\uff0c\u5bfc\u6570\u4e3a 0\uff0c\u5c31\u518d\u4e5f\u4e0d\u4f1a\u66f4\u65b0\u4e86</li>"
                "<li>\u2718 \u8f93\u51fa\u4e0d\u662f\u96f6\u4e2d\u5fc3\u7684</li>"
                "</ul>"
                "<p><b>Leaky ReLU\uff08\u6539\u8fdb\u7248\uff09\uff1a</b></p>"
                "<pre>LeakyReLU(x) = max(0.01x, x)</pre>"
                "<p>\u8ba9\u8d1f\u533a\u95f4\u4e5f\u6709\u4e00\u4e2a\u5f88\u5c0f\u7684\u659c\u7387\uff080.01\uff09\uff0c"
                "\u89e3\u51b3 Dead ReLU \u95ee\u9898\u3002\u53e6\u5916\u8fd8\u6709 PReLU\uff08\u53c2\u6570\u5316\uff09"
                "\u548c ELU\uff08\u6307\u6570\u7ebf\u6027\u5355\u5143\uff09\u3002</p>"
            )
        },
        {
            "type": "formula",
            "title": "ReLU \u516c\u5f0f\u4e0e\u53c2\u6570",
            "content": (
                "<p><b>\u516c\u5f0f\uff08\u5305\u62ec\u53d8\u79cd\uff09\uff1a</b></p>"
                "<table>"
                "<tr><th>\u540d\u79f0</th><th>\u516c\u5f0f</th><th>\u7279\u70b9</th></tr>"
                "<tr><td>ReLU</td><td>max(0, x)</td><td>\u6700\u7b80\u5355\uff0c\u88ab\u8bc1\u660e\u6700\u6709\u6548\u7684\u57fa\u7840\u6fc0\u6d3b</td></tr>"
                "<tr><td>Leaky ReLU</td><td>max(\u03b1x, x), \u03b1=0.01</td><td>\u8d1f\u533a\u95f4\u5c0f\u659c\u7387\uff0c\u89e3\u51b3Dead ReLU</td></tr>"
                "<tr><td>PReLU</td><td>max(\u03b1x, x), \u03b1\u53ef\u5b66\u4e60</td><td>\u03b1\u662f\u53c2\u6570\uff0c\u8ddf\u6743\u91cd\u4e00\u8d77\u8bad\u7ec3</td></tr>"
                "<tr><td>ELU</td><td>x\u00a0(x\u22650), \u03b1(e^x-1)\u00a0(x<0)</td><td>\u8d1f\u533a\u95f4\u8d8b\u4e8e-\u03b1\uff0c\u66f4\u7a33\u5b9a</td></tr>"
                "</table>"
                "<p><b>\u53c2\u6570\u8868\uff08ReLU\uff09\uff1a</b></p>"
                "<table>"
                "<tr><th>\u53c2\u6570</th><th>\u503c</th><th>\u8bf4\u660e</th></tr>"
                "<tr><td>\u8f93\u5165\u8303\u56f4</td><td>(-\u221e, +\u221e)</td><td>\u4efb\u610f\u5b9e\u6570</td></tr>"
                "<tr><td>\u8f93\u51fa\u8303\u56f4</td><td>[0, +\u221e)</td><td>\u975e\u8d1f</td></tr>"
                "<tr><td>ReLU(0)</td><td>0</td><td>\u4e0d\u53ef\u5bfc\u70b9</td></tr>"
                "<tr><td>\u5bfc\u6570(x>0)</td><td>1</td><td>\u6052\u4e3a 1\uff0c\u65e0\u68af\u5ea6\u6d88\u5931</td></tr>"
                "<tr><td>\u5bfc\u6570(x<0)</td><td>0</td><td>Dead ReLU \u539f\u56e0</td></tr>"
                "<tr><td>\u8ba1\u7b97\u91cf</td><td>O(1)</td><td>\u4e00\u4e2a if \u5224\u65ad</td></tr>"
                "</table>"
                "<p><b>\u68af\u5ea6\u6d88\u5931\u5bf9\u6bd4\u6d4b\u8bd5\uff1a</b></p>"
                "<p>\u8bbe\u6df1\u5ea6\u4e3a 10 \u5c42\u7684\u7f51\u7edc\uff1a</p>"
                "<pre>Sigmoid: \u68af\u5ea6 < 0.25^10 \u2248 9.5e-7 (\u6b7b\u4ea1)\nReLU: \u68af\u5ea6 = 1^10 = 1 (\u5b8c\u597d)</pre>"
                "<p>\u8fd9\u5c31\u662f\u4e3a\u4ec0\u4e48\u6df1\u5c42\u7f51\u7edc\u51e0\u4e4e\u90fd\u7528 ReLU \u800c\u4e0d\u7528 Sigmoid\u3002</p>"
            )
        },
        {
            "type": "example",
            "title": "ReLU \u6570\u503c\u4f8b\u5b50",
            "content": (
                "<p>\u7ed9\u5b9a\u8f93\u5165 x = [-5, -2, -0.1, 0, 0.5, 3, 10]\uff0c\u8ba1\u7b97 ReLU \u503c\u548c\u5bfc\u6570\u3002</p>"
                "<p><b>\u8ba1\u7b97\u8868\uff1a</b></p>"
                "<table>"
                "<tr><th>x</th><th>ReLU(x)</th><th>ReLU'(x)</th><th>\u72b6\u6001</th></tr>"
                "<tr><td>-5</td><td>0</td><td>0</td><td>\u6b7b\u4ea1</td></tr>"
                "<tr><td>-2</td><td>0</td><td>0</td><td>\u6b7b\u4ea1</td></tr>"
                "<tr><td>-0.1</td><td>0</td><td>0</td><td>\u4e34\u754c\uff08\u63a5\u8fd1 0\uff09</td></tr>"
                "<tr><td>0</td><td>0</td><td>\u672a\u5b9a\u4e49</td><td>\u5355\u70b9\u4e0d\u53ef\u5bfc</td></tr>"
                "<tr><td>0.5</td><td>0.5</td><td>1</td><td>\u6d3b\u8dc3</td></tr>"
                "<tr><td>3</td><td>3</td><td>1</td><td>\u6d3b\u8dc3</td></tr>"
                "<tr><td>10</td><td>10</td><td>1</td><td>\u6d3b\u8dc3</td></tr>"
                "</table>"
                "<p><b>\u4e00\u4e2a\u5b8c\u6574\u7684\u524d\u5411\u4f20\u64ad\u4f8b\u5b50\uff1a</b></p>"
                "<p>\u5047\u8bbe\u4e00\u5c42\u795e\u7ecf\u7f51\u7edc\uff0c\u6743\u91cd W = [0.5, -0.3, 0.8]\uff0c\u504f\u7f6e b = 0.1\uff0c"
                "\u8f93\u5165 x = [2, -1, 3]\u3002</p>"
                "<pre>\u6b65\u9aa4 1: z = W\u00b7x + b = 0.5\u00d72 + (-0.3)\u00d7(-1) + 0.8\u00d73 + 0.1\n           = 1.0 + 0.3 + 2.4 + 0.1\n           = 3.8\n\n\u6b65\u9aa4 2: a = ReLU(3.8) = max(0, 3.8) = 3.8</pre>"
                "<p>\u5982\u679c\u6362\u4e00\u7ec4\u8f93\u5165 x = [-2, 1, -0.5]\uff1a</p>"
                "<pre>z = 0.5\u00d7(-2) + (-0.3)\u00d71 + 0.8\u00d7(-0.5) + 0.1\n  = -1.0 - 0.3 - 0.4 + 0.1\n  = -1.6\na = ReLU(-1.6) = 0</pre>"
                "<p>\u8fd9\u4e2a\u795e\u7ecf\u5143\u5bf9\u4e8e\u8fd9\u4e2a\u6837\u672c\u201c\u6b7b\u4ea1\u201d\u4e86\u3002"
                "\u5982\u679c\u6240\u6709\u6837\u672c\u5bf9\u8be5\u795e\u7ecf\u5143\u7684 z \u90fd < 0\uff0c"
                "\u5b83\u5c31\u6c38\u8fdc\u4e0d\u4f1a\u66f4\u65b0\u4e86\u2014\u2014Dead ReLU\u3002</p>"
            )
        },
        {
            "type": "exercise",
            "title": "ReLU \u7ec3\u4e60",
            "content": (
                "<p><b>Q1\uff1a</b>\u8ba1\u7b97\u5982\u4e0b\u8f93\u5165\u7684 ReLU \u503c\uff1ax = [-100, -0.001, 0, 0.001, 100]\u3002"
                "\u8bf7\u95ee\u6709\u51e0\u4e2a\u70b9\u7684\u5bfc\u6570\u4e3a 0\uff1f</p>"
                "<p><b>Q2\uff1a</b>\u4ec0\u4e48\u662f Dead ReLU \u73b0\u8c61\uff1f\u5982\u4f55\u68c0\u6d4b\u548c\u89e3\u51b3\uff1f</p>"
                "<p><b>Q3\uff1a</b>ReLU \u5728 x=0 \u5904\u4e0d\u53ef\u5bfc\uff0c\u5b9e\u9645\u8bad\u7ec3\u4e2d\u600e\u4e48\u529e\uff1f</p>"
                "<p><b>Q4\uff1a</b>\u4e00\u5c42 ReLU \u7f51\u7edc\u6709 100 \u4e2a\u795e\u7ecf\u5143\uff0c"
                "\u8f93\u5165\u6570\u636e\u7684 80% \u4f7f\u5f97 z < 0\u3002"
                "\u8fd9\u610f\u5473\u7740\u4ec0\u4e48\uff1f\u5982\u4f55\u4f18\u5316\uff1f</p>"
                "<p><b>Q5\uff1a</b>\u8ba1\u7b97\u4e00\u4e2a ReLU \u795e\u7ecf\u5143\u7684\u53cd\u5411\u4f20\u64ad\uff1a"
                "\u5047\u8bbe\u4e0a\u6e38\u68af\u5ea6 dL/da = 2\uff0c\u8f93\u5165 z = -1\uff0c"
                "\u8bf7\u95ee dL/dz \u662f\u591a\u5c11\uff1f"
                "\u5982\u679c z = 3\uff0cdL/dz \u53c8\u662f\u591a\u5c11\uff1f</p>"
            ),
            "answer": (
                "<p><b>A1\uff1a</b></p>"
                "<pre>x = -100 \u2192 ReLU = 0, \u5bfc\u6570 = 0\nx = -0.001 \u2192 ReLU = 0, \u5bfc\u6570 = 0\nx = 0 \u2192 ReLU = 0, \u5bfc\u6570\u672a\u5b9a\u4e49\nx = 0.001 \u2192 ReLU = 0.001, \u5bfc\u6570 = 1\nx = 100 \u2192 ReLU = 100, \u5bfc\u6570 = 1</pre>"
                "<p>2 \u4e2a\u70b9\u7684\u5bfc\u6570\u4e3a 0\uff08\u4e0d\u7b97 x=0\uff09\u3002</p>"
                "<p><b>A2\uff1a</b></p>"
                "<p>\u5f53\u795e\u7ecf\u5143\u7684\u6743\u91cd\u521d\u59cb\u5316\u5904\u5728\u201c\u8d1f\u533a\u57df\u201d\uff0c"
                "\u6216\u5b66\u4e60\u7387\u8fc7\u5927\u5bfc\u81f4\u6743\u91cd\u8df3\u5230\u201c\u6c38\u8fdc\u8d1f\u201d\u7684\u533a\u57df\u65f6\uff0c"
                "\u8be5\u795e\u7ecf\u5143\u5bf9\u6240\u6709\u8f93\u5165\u90fd\u8f93\u51fa 0\uff0c\u68af\u5ea6\u4e3a 0\uff0c\u518d\u4e5f\u4e0d\u4f1a\u66f4\u65b0\u3002</p>"
                "<p>\u68c0\u6d4b\uff1a\u8bad\u7ec3\u4e2d\u76d1\u63a7\u795e\u7ecf\u5143\u8f93\u51fa\u4e3a 0 \u7684\u6bd4\u4f8b\u3002</p>"
                "<p>\u89e3\u51b3\uff1a\u7528 Leaky ReLU/PReLU\uff0c\u6216\u8c03\u6574\u521d\u59cb\u5316\uff08\u5982 He \u521d\u59cb\u5316\uff09\u3002</p>"
                "<p><b>A3\uff1a</b></p>"
                "<p>\u5b9e\u9645\u4e2d\u7b80\u5355\u5904\u7406\uff1a\u5f53 x > 0 \u65f6\u5bfc\u6570\u4e3a 1\uff0c"
                "x \u2264 0 \u65f6\u5bfc\u6570\u4e3a 0\u3002"
                "\u7531\u4e8e\u8ba1\u7b97\u673a\u6d6e\u70b9\u6570\u51c6\u786e\u7b49\u4e8e 0 \u7684\u6982\u7387\u6781\u4f4e\uff0c\u8fd9\u4e2a\u95ee\u9898\u5b9e\u9645\u4e0a\u4e0d\u4f1a\u51fa\u73b0\u3002</p>"
                "<p><b>A4\uff1a</b></p>"
                "<p>80% \u7684\u795e\u7ecf\u5143\u201c\u6b7b\u4ea1\u201d\u610f\u5473\u7740\u7f51\u7edc\u7684\u8868\u793a\u80fd\u529b\u5927\u5e45\u4e0b\u964d\u3002"
                "\u53ef\u80fd\u539f\u56e0\uff1a\u5b66\u4e60\u7387\u8fc7\u5927\u3001\u504f\u7f6e\u521d\u59cb\u5316\u4e0d\u5f53\u3002"
                "\u4f18\u5316\uff1a\u964d\u4f4e\u5b66\u4e60\u7387\u3001\u4f7f\u7528 He \u521d\u59cb\u5316\u3001\u6362 Leaky ReLU\u3002</p>"
                "<p><b>A5\uff1a</b></p>"
                "<p>\u53cd\u5411\u4f20\u64ad\uff1adL/dz = ReLU'(z) \u00d7 dL/da</p>"
                "<pre>\u5f53 z = -1: ReLU'(-1) = 0 \u2192 dL/dz = 0 \u00d7 2 = 0\n\u5f53 z = 3: ReLU'(3) = 1 \u2192 dL/dz = 1 \u00d7 2 = 2</pre>"
                "<p>\u6240\u4ee5 ReLU \u7684\u53cd\u5411\u4f20\u64ad\u6781\u5176\u7b80\u5355\u2014\u2014"
                "\u6d3b\u8dc3\u65f6\u76f4\u63a5\u4f20\u9012\u68af\u5ea6\uff0c\u6b7b\u4ea1\u65f6\u5207\u65ad\u68af\u5ea6\u3002</p>"
            )
        },

        # ============================================================
        # SECTION 5: GELU
        # ============================================================
        {
            "type": "text",
            "title": "GELU \u6fc0\u6d3b\u51fd\u6570",
            "content": (
                "<p><b>GELU\uff08\u300c\u300a\u5609\u5fb7\u5c14\u300b\u6fc0\u6d3b\u51fd\u6570\uff0cGaussian Error Linear Unit\uff09</b>"
                "\u662f Transformer \u65f6\u4ee3\u7684\u6807\u914d\u6fc0\u6d3b\u51fd\u6570\u3002"
                "\u5b83\u88ab BERT\u3001GPT \u7cfb\u5217\u3001LLaMA \u7b49\u6240\u6709\u73b0\u4ee3 LLM \u4f7f\u7528\u3002</p>"
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>GELU(x) = x \u00d7 \u03a6(x)</pre>"
                "<p>\u5176\u4e2d \u03a6(x) \u662f\u6807\u51c6\u6b63\u6001\u5206\u5e03\u7684\u7d2f\u79ef\u5206\u5e03\u51fd\u6570\uff08CDF\uff09\u3002</p>"
                "<p><b>\u8fd1\u4f3c\u516c\u5f0f\uff08\u5b9e\u9645\u4f7f\u7528\uff09\uff1a</b></p>"
                "<pre>GELU(x) \u2248 0.5x \u00d7 (1 + tanh(\u221a(2/\u03c0) \u00d7 (x + 0.044715x^3)))</pre>"
                "<p><b>\u751f\u6d3b\u6bd4\u55bb\uff1a\u6e29\u67d4\u7684\u9009\u62e9\u5668</b></p>"
                "<p>ReLU \u50cf\u4e00\u4e2a\u7c97\u7cd9\u7684\u201c\u662f\u201d\u201c\u5426\u201d\u5f00\u5173\u3002"
                "GELU \u5219\u50cf\u4e00\u4e2a\u5c0f\u7ec4\u6210\u5458\u6295\u7968\u2014\u2014"
                "\u6bcf\u4e2a\u8f93\u5165\u90fd\u6839\u636e\u5b83\u7684\u201c\u53ef\u80fd\u6027\u201d\u88ab\u6743\u91cd\u864e\u51b3\u3002"
                "\u5982\u679c x \u6b63\u4e14\u5927\uff08\u201c\u662f\u201d\u7684\u53ef\u80fd\u6027\u9ad8\uff09\uff0c\u5c31\u4fdd\u6301\u5927\u90e8\u5206\u503c\uff1b"
                "\u5982\u679c x \u8d1f\u4e14\u5c0f\uff08\u201c\u5426\u201d\u7684\u53ef\u80fd\u6027\u9ad8\uff09\uff0c\u5c31\u538b\u5236\u5230\u63a5\u8fd1 0\uff1b"
                "\u5982\u679c x \u5728 0 \u9644\u8fd1\uff0c\u5219\u6839\u636e\u6b63\u6001\u5206\u5e03\u505a\u5e73\u6ed1\u51b3\u7b56\u3002</p>"
                "<p><b>\u4f18\u7f3a\u70b9\uff1a</b></p>"
                "<ul>"
                "<li>\u2714 \u5e73\u6ed1\u4e14\u5168\u5c40\u53ef\u5bfc\uff08\u6bd4 ReLU \u66f4\u201c\u81ea\u7136\u201d\uff09</li>"
                "<li>\u2714 \u8f93\u51fa\u5728\u8d1f\u533a\u57df\u4e5f\u6709\u5c0f\u7684\u975e\u96f6\u503c\uff0c\u4fdd\u7559\u90e8\u5206\u4fe1\u606f</li>"
                "<li>\u2714 \u5728 Transformer \u4e2d\u6548\u679c\u7ecf\u5178\u9a8c\u8bc1\u4f18\u4e8e ReLU</li>"
                "<li>\u2718 \u8ba1\u7b97\u6210\u672c\u9ad8\u4e8e ReLU\uff08\u9700\u8981\u8ba1\u7b97\u6b63\u6001 CDF \u6216 tanh \u8fd1\u4f3c\uff09</li>"
                "</ul>"
                "<p><b>Swish/SiLU\uff08\u53e6\u4e00\u4e2a\u76f8\u4f3c\u7684\u6fc0\u6d3b\u51fd\u6570\uff09\uff1a</b></p>"
                "<pre>Swish(x) = x \u00d7 \u03c3(x) = x / (1 + e^{-x})</pre>"
                "<p>GELU \u548c Swish \u975e\u5e38\u63a5\u8fd1\uff0c\u5728\u5b9e\u9645\u5e94\u7528\u4e2d\uff08\u5982 Transformer\uff09\u6548\u679c\u51e0\u4e4e\u4e00\u6837\u3002"
                "LLaMA \u7528\u7684 SwiGLU \u5c31\u662f Swish \u7684\u53d8\u79cd\u3002</p>"
            )
        },
        {
            "type": "formula",
            "title": "GELU \u516c\u5f0f\u4e0e\u53c2\u6570",
            "content": (
                "<p><b>\u7cbe\u786e\u516c\u5f0f\uff1a</b></p>"
                "<pre>GELU(x) = x \u00d7 \u03a6(x) = x \u00d7 P(X \u2264 x)\n\u5176\u4e2d X ~ N(0,1)</pre>"
                "<p>\u03a6(x) = \u222b_{-\\infty}^{x} (1/\u221a(2\u03c0)) \u00d7 e^{-t^2/2} dt</p>"
                "<p><b>\u8fd1\u4f3c\u516c\u5f0f\uff08Tanh \u8fd1\u4f3c\uff09\uff1a</b></p>"
                "<pre>GELU(x) \u2248 0.5x \u00d7 (1 + tanh(\u221a(2/\u03c0) \u00d7 (x + 0.044715x^3)))</pre>"
                "<p><b>\u66f4\u7b80\u5355\u7684\u8fd1\u4f3c\uff1a</b></p>"
                "<pre>GELU(x) \u2248 x \u00d7 \u03c3(1.702x)</pre>"
                "<p>\u5176\u4e2d \u03c3 \u662f Sigmoid\uff0c1.702 \u662f\u6700\u4f18\u7f29\u653e\u5339\u914d\u503c\u3002</p>"
                "<p><b>\u53c2\u6570\u8868\uff1a</b></p>"
                "<table>"
                "<tr><th>\u53c2\u6570</th><th>\u503c</th><th>\u8bf4\u660e</th></tr>"
                "<tr><td>\u8f93\u5165\u8303\u56f4</td><td>(-\u221e, +\u221e)</td><td>\u4efb\u610f\u5b9e\u6570</td></tr>"
                "<tr><td>\u8f93\u51fa\u8303\u56f4</td><td>\u2248 [-0.17, +\u221e)</td><td>\u6700\u5c0f\u503c\u7ea6 -0.17</td></tr>"
                "<tr><td>GELU(0)</td><td>0</td><td>\u7ecf\u8fc7\u539f\u70b9</td></tr>"
                "<tr><td>\u6700\u5c0f\u503c</td><td>\u2248 -0.17 (x \u2248 -0.75\u65f6)</td><td>\u8d1f\u533a\u57df\u6709\u5c0f\u7684\u8d1f\u503c</td></tr>"
                "<tr><td>\u6b63\u5411\u8d8b\u52bf</td><td>x \u2192 +\u221e, GELU \u2192 x</td><td>\u5927\u6b63\u6570\u65f6\u8fd1\u4f3c\u7ebf\u6027</td></tr>"
                "<tr><td>\u8d1f\u5411\u8d8b\u52bf</td><td>x \u2192 -\u221e, GELU \u2192 0</td><td>\u5927\u8d1f\u6570\u65f6\u538b\u5236\u4e3a 0</td></tr>"
                "</table>"
                "<p><b>\u5bfc\u6570\u7b80\u4ecb\uff08\u590d\u6742\uff0c\u771f\u5b9e\u5b9e\u73b0\u7528\u81ea\u52a8\u5fae\u5206\uff09\uff1a</b></p>"
                "<pre>GELU'(x) = \u03a6(x) + x \u00d7 \u03c6(x)\n\u5176\u4e2d \u03c6(x) = N(0,1) \u7684\u6982\u7387\u5bc6\u5ea6\u51fd\u6570 = (1/\u221a(2\u03c0))e^{-x^2/2}</pre>"
            )
        },
        {
            "type": "example",
            "title": "GELU \u6570\u503c\u4f8b\u5b50",
            "content": (
                "<p>\u7ed9\u5b9a\u8f93\u5165 x = [-3, -1, -0.75, -0.5, 0, 0.5, 1, 3]\uff0c"
                "\u7528\u8fd1\u4f3c\u516c\u5f0f\u8ba1\u7b97 GELU \u503c\u3002</p>"
                "<p><b>\u8fd1\u4f3c\u516c\u5f0f\uff1a</b> GELU(x) \u2248 0.5x \u00d7 (1 + tanh(0.79788 \u00d7 (x + 0.044715x^3)))</p>"
                "<p><b>\u8ba1\u7b97\u6b65\u9aa4\uff08\u4ee5 x=1 \u4e3a\u4f8b\uff09\uff1a</b></p>"
                "<pre>\u6b65\u9aa4 1: x^3 = 1^3 = 1\n\u6b65\u9aa4 2: x + 0.044715x^3 = 1 + 0.044715 = 1.044715\n\u6b65\u9aa4 3: \u221a(2/\u03c0) \u2248 0.79788\n\u6b65\u9aa4 4: 0.79788 \u00d7 1.044715 = 0.8336\n\u6b65\u9aa4 5: tanh(0.8336) \u2248 0.6827\n\u6b65\u9aa4 6: 0.5 \u00d7 1 \u00d7 (1 + 0.6827) = 0.5 \u00d7 1.6827 = 0.8414</pre>"
                "<p><b>\u5b8c\u6574\u7ed3\u679c\uff1a</b></p>"
                "<table>"
                "<tr><th>x</th><th>x + 0.0447x^3</th><th>inner</th><th>tanh</th><th>GELU(x)</th></tr>"
                "<tr><td>-3.00</td><td>-4.207</td><td>-3.357</td><td>-0.998</td><td>0.003</td></tr>"
                "<tr><td>-1.00</td><td>-1.045</td><td>-0.834</td><td>-0.683</td><td>-0.159</td></tr>"
                "<tr><td>-0.75</td><td>-0.731</td><td>-0.583</td><td>-0.525</td><td>-0.178</td></tr>"
                "<tr><td>-0.50</td><td>-0.506</td><td>-0.404</td><td>-0.384</td><td>-0.154</td></tr>"
                "<tr><td>0.00</td><td>0.000</td><td>0.000</td><td>0.000</td><td>0.000</td></tr>"
                "<tr><td>0.50</td><td>0.506</td><td>0.404</td><td>0.384</td><td>0.346</td></tr>"
                "<tr><td>1.00</td><td>1.045</td><td>0.834</td><td>0.683</td><td>0.841</td></tr>"
                "<tr><td>3.00</td><td>4.207</td><td>3.357</td><td>0.998</td><td>2.997</td></tr>"
                "</table>"
                "<p><b>\u5173\u952e\u89c2\u5bdf\uff1a</b></p>"
                "<ul>"
                "<li>GELU \u5728\u8d1f\u533a\u57df\u6709\u4e00\u4e2a\u5c0f\u7684\u8d1f\u6700\u5c0f\u503c\u2248 -0.17\uff08\u800c ReLU \u4e3a 0\uff09</li>"
                "<li>\u8fd9\u610f\u5473\u7740\u8d1f\u503c\u4e0d\u662f\u76f4\u63a5\u622a\u65ad\uff0c\u800c\u662f\u201c\u9075\u5faa\u201d\u5730\u538b\u5236</li>"
                "<li>\u8fd9\u5c0f\u5c0f\u7684\u5dee\u5f02\u8ba9 Transformer \u66f4\u5bb9\u6613\u4f20\u64ad\u68af\u5ea6</li>"
                "</ul>"
            )
        },
        {
            "type": "exercise",
            "title": "GELU \u7ec3\u4e60",
            "content": (
                "<p><b>Q1\uff1a</b>\u7528\u7b80\u5316\u8fd1\u4f3c GELU(x) \u2248 x \u00d7 \u03c3(1.702x) \u8ba1\u7b97 x = 2 \u65f6\u7684\u503c\u3002</p>"
                "<p><b>Q2\uff1a</b>GELU \u548c ReLU \u6709\u4ec0\u4e48\u672c\u8d28\u533a\u522b\uff1f"
                "\u4e3a\u4ec0\u4e48 Transformer \u9009\u62e9 GELU \u800c\u4e0d\u662f ReLU\uff1f</p>"
                "<p><b>Q3\uff1a</b>\u8ba1\u7b97 GELU \u5728 x = -0.75 \u5904\u7684\u503c\uff0c"
                "\u5e76\u89e3\u91ca\u8fd9\u4e2a\u8d1f\u503c\u5bf9\u7f51\u7edc\u6709\u4ec0\u4e48\u4f5c\u7528\u3002</p>"
                "<p><b>Q4\uff1a</b>Swish \u548c GELU \u6709\u4ec0\u4e48\u5173\u7cfb\uff1f"
                "\u8bd5\u6bd4\u8f83 Swish(x) = x\u03c3(x) \u548c GELU(x) \u7684\u8fd1\u4f3c\u5f62\u5f0f x\u03c3(1.702x)\u3002"
                "\u4f60\u80fd\u770b\u51fa\u4ec0\u4e48\uff1f</p>"
                "<p><b>Q5\uff1a</b>\u4e3a\u4ec0\u4e48 GELU \u7684\u8d1f\u533a\u57df\u5bfc\u6570\u4e0d\u4e3a 0\uff1f"
                "\u8fd9\u5bf9\u68af\u5ea6\u4f20\u64ad\u6709\u4ec0\u4e48\u597d\u5904\uff1f</p>"
            ),
            "answer": (
                "<p><b>A1\uff1a</b></p>"
                "<pre>x = 2\n1.702x = 3.404\n\u03c3(3.404) = 1 / (1 + e^{-3.404}) = 1 / (1 + 0.0333) = 0.9678\nGELU(2) \u2248 2 \u00d7 0.9678 = 1.9356</pre>"
                "<p><b>A2\uff1a</b></p>"
                "<p>ReLU \u662f\u786c\u622a\u65ad\uff08x<0 \u65f6\u4e3a 0\uff09\uff0cGELU \u662f\u5e73\u6ed1\u538b\u5236\uff08x<0 \u65f6\u4ecd\u6709\u975e\u96f6\u503c\u3001\u975e\u96f6\u5bfc\u6570\uff09\u3002</p>"
                "<p>Transformer \u9009 GELU \u7684\u539f\u56e0\uff1a</p>"
                "<ul>"
                "<li>GELU \u5904\u5904\u53ef\u5bfc\uff0c\u5bf9\u68af\u5ea6\u4f20\u64ad\u66f4\u53cb\u597d</li>"
                "<li>\u8d1f\u533a\u57df\u7684\u5c0f\u975e\u96f6\u503c\u4fdd\u7559\u90e8\u5206\u4fe1\u606f</li>"
                "<li>\u5728\u5927\u89c4\u6a21\u8bad\u7ec3\u4e2d\u8868\u73b0\u66f4\u7a33\u5b9a</li>"
                "</ul>"
                "<p><b>A3\uff1a</b></p>"
                "<pre>\u7531\u4e0a\u8868\uff0cGELU(-0.75) \u2248 -0.178</pre>"
                "<p>\u8fd9\u4e2a\u8d1f\u503c\u610f\u5473\u7740\u5f53\u8f93\u5165\u662f\u8d1f\u7684\u4f46\u8d1f\u5f97\u4e0d\u591a\u65f6\uff0c"
                "\u795e\u7ecf\u5143\u4ecd\u7136\u4f20\u9012\u4e00\u4e2a\u5c0f\u7684\u8d1f\u4fe1\u53f7\u3002"
                "\u8fd9\u53ef\u4ee5\u5e2e\u52a9\u7f51\u7edc\u5b66\u4e60\u66f4\u7cbe\u7ec6\u7684\u6a21\u5f0f\uff0c\u800c\u4e0d\u662f\u7c97\u7cd9\u5730\u629b\u5f03\u6240\u6709\u8d1f\u4fe1\u606f\u3002</p>"
                "<p><b>A4\uff1a</b></p>"
                "<p>Swish(x) = x\u03c3(x) = x/(1+e^{-x})\u3002"
                "\u800c GELU \u7684\u8fd1\u4f3c\u662f x\u03c3(1.702x)\uff0c\u4e5f\u5c31\u662f\u8bf4 GELU \u2248 Swish(1.702x)\uff0c"
                "\u4ec5\u4ec5\u662f\u5c06 Swish \u7684\u8f93\u5165\u7f29\u653e\u4e86\u7ea6 1.7 \u500d\u3002"
                "\u4e24\u8005\u51e0\u4e4e\u4e00\u6837\uff0c\u5728\u5b9e\u9645\u5e94\u7528\u4e2d\u6548\u679c\u76f8\u4f3c\u3002</p>"
                "<p><b>A5\uff1a</b></p>"
                "<p>GELU \u5728\u8d1f\u533a\u57df\u7684\u5bfc\u6570\u4e0d\u4e3a 0\uff0c\u610f\u5473\u7740\u5f53\u795e\u7ecf\u5143\u8f93\u5165\u4e3a\u8d1f\u65f6\uff0c"
                "\u68af\u5ea6\u4ecd\u7136\u80fd\u591f\u6d41\u56de\u53bb\u66f4\u65b0\u6743\u91cd\u3002"
                "\u8fd9\u89e3\u51b3\u4e86\u201cDead ReLU\u201d\u95ee\u9898\uff0c\u8ba9 Transformer \u7684\u6df1\u5c42\u7f51\u7edc\u66f4\u7a33\u5b9a\u5730\u8bad\u7ec3\u3002</p>"
            )
        },

        # ============================================================
        # SECTION 6: SOFTMAX
        # ============================================================
        {
            "type": "text",
            "title": "Softmax \u6fc0\u6d3b\u51fd\u6570",
            "content": (
                "<p><b>Softmax</b>\u4e0d\u662f\u548c\u524d\u56db\u4e2a\u4e00\u6837\u7684\u201c\u795e\u7ecf\u5143\u5185\u201d\u6fc0\u6d3b\u51fd\u6570\u2014\u2014"
                "\u5b83\u901a\u5e38\u7528\u5728\u7f51\u7edc\u7684\u6700\u540e\u4e00\u5c42\uff0c"
                "\u5c06\u4e00\u4e2a\u4efb\u610f\u7684\u5b9e\u6570\u5411\u91cf\u8f6c\u5316\u4e3a\u4e00\u4e2a\u6982\u7387\u5206\u5e03\u3002</p>"
                "<p><b>\u751f\u6d3b\u6bd4\u55bb\uff1a\u6295\u7968\u7edf\u8ba1</b></p>"
                "<p>\u60f3\u8c61\u516c\u53f8\u9009\u62e9 CEO\uff0c\u6709 3 \u4f4d\u5019\u9009\u4eba\uff1a"
                "\u5f97\u7968\u6570\u5206\u522b\u662f 100\u3001500\u30002000\u3002"
                "\u5982\u679c\u76f4\u63a5\u770b\u5f97\u7968\u6bd4\u4f8b\uff1a4.5%\u300122.7%\u300172.7%\u3002"
                "\u4f46\u5982\u679c\u7ed9\u5019\u9009\u4eba\u7684\u201c\u5f97\u5206\u201d\u662f 80\u300185\u300190\uff0c\u76f4\u63a5\u6bd4\u4f8b\u662f 31.4%\u300133.3%\u300135.3%\uff0c\u5dee\u8ddd\u4e0d\u5927\u3002"
                "Softmax \u80fd\u5c06\u201c\u5f97\u5206\u5dee\u8ddd\u201d\u653e\u5927\uff08\u901a\u8fc7\u6307\u6570\uff09\uff0c"
                "\u8ba9\u9ad8\u5206\u8005\u83b7\u5f97\u66f4\u5927\u7684\u6982\u7387\u3002</p>"
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>Softmax(z)\u1d62 = e^{z\u1d62} / \u2211\u2c7c\u2097\u2081 e^{z\u2c7c}</pre>"
                "<p>\u5176\u4e2d z \u662f\u8f93\u5165\u5411\u91cf\uff0cz\u1d62 \u662f\u7b2c i \u4e2a\u5143\u7d20\u3002</p>"
                "<p><b>Softmax \u7279\u6027\uff1a</b></p>"
                "<ul>"
                "<li>\u8f93\u51fa\u5408\u4e3a 1\uff1a\u2211 Softmax(z)\u1d62 = 1</li>"
                "<li>\u6bcf\u4e2a\u8f93\u51fa\u5728 (0, 1) \u4e4b\u95f4</li>"
                "<li>\u0391\u8651\u76f8\u5bf9\u5927\u5c0f\u5173\u7cfb\uff1a\u8f93\u5165\u8d8a\u5927\uff0c\u8f93\u51fa\u6982\u7387\u8d8a\u5927</li>"
                "<li>\u6307\u6570\u64cd\u4f5c\u653e\u5927\u5dee\u8ddd\uff08\u201c\u52c7\u6562\u201d\u51b3\u7b56\uff09</li>"
                "</ul>"
                "<p><b>\u6e29\u5ea6\u53c2\u6570\u7248\uff1a</b></p>"
                "<pre>Softmax\u03c4(z)\u1d62 = e^{z\u1d62/\u03c4} / \u2211 e^{z\u2c7c/\u03c4}</pre>"
                "<p>\u03c4 > 1\uff1a\u5206\u5e03\u66f4\u201c\u5e73\u5766\u201d\uff08\u6e29\u548c\uff09\uff1b"
                "\u03c4 < 1\uff1a\u5206\u5e03\u66f4\u201c\u5c16\u9510\u201d\uff08\u6781\u7aef\uff09\u3002"
                "\u8fd9\u5728\u77e5\u8bc6\u84b8\u998f\uff08Knowledge Distillation\uff09\u548c\u8bed\u8a00\u6a21\u578b\u7684\u91c7\u6837\u4e2d\u5e38\u7528\u3002</p>"
                "<p><b>\u5bfc\u6570\uff1a</b></p>"
                "<pre>\u2202S\u1d62/\u2202z\u2c7c = S\u1d62(\u03b4\u1d62\u2c7c - S\u2c7c)\n\u5176\u4e2d \u03b4\u1d62\u2c7c = 1 \u5f53 i = j, \u5426\u5219 0</pre>"
                "<p>\u8fd9\u610f\u5473\u7740\uff1a</p>"
                "<ul>"
                "<li>\u5bf9\u81ea\u5df1\u7684\u5bfc\u6570\uff1a\u2202S\u1d62/\u2202z\u1d62 = S\u1d62(1 - S\u1d62)</li>"
                "<li>\u5bf9\u5176\u4ed6\u7684\u5bfc\u6570\uff1a\u2202S\u1d62/\u2202z\u2c7c = -S\u1d62S\u2c7c</li>"
                "</ul>"
            )
        },
        {
            "type": "formula",
            "title": "Softmax \u516c\u5f0f\u4e0e\u53c2\u6570",
            "content": (
                "<p><b>\u516c\u5f0f\uff1a</b></p>"
                "<pre>Softmax(z)\u1d62 = e^{z\u1d62} / \u2211_{j=1}^{k} e^{z_j}</pre>"
                "<p>\u5176\u4e2d z \u662f\u957f\u5ea6\u4e3a k \u7684\u5411\u91cf\u3002</p>"
                "<p><b>\u53c2\u6570\u8868\uff1a</b></p>"
                "<table>"
                "<tr><th>\u53c2\u6570</th><th>\u8bf4\u660e</th></tr>"
                "<tr><td>\u8f93\u5165</td><td>\u4efb\u610f\u5b9e\u6570\u5411\u91cf z \u2208 \u211d^k</td></tr>"
                "<tr><td>\u8f93\u51fa</td><td>\u6982\u7387\u5411\u91cf p \u2208 [0,1]^k\uff0c\u2211p = 1</td></tr>"
                "<tr><td>\u5e38\u7528\u573a\u666f</td><td>\u5206\u7c7b\u7f51\u7edc\u6700\u540e\u4e00\u5c42\u3001\u6ce8\u610f\u529b\u6743\u91cd</td></tr>"
                "<tr><td>\u914d\u5957\u635f\u5931</td><td>Cross-Entropy Loss</td></tr>"
                "<tr><td>\u5bfc\u6570\u4f18\u5316</td><td>Softmax + CE \u7684\u68af\u5ea6 = \u0177 - y\uff08\u5373\u9884\u6d4b\u51cf\u771f\u5b9e\uff09</td></tr>"
                "</table>"
                "<p><b>\u201cSoftmax + CrossEntropy\u201d\u68af\u5ea6\u63a8\u5bfc\uff1a</b></p>"
                "<p>\u8bbey = [0, 1, 0, ..., 0] \u4e3a one-hot \u771f\u5b9e\u6807\u7b7e\uff0c\u0177 = softmax(z)\u3002</p>"
                "<pre>Loss = -\u2211 y_j \u00b7 log(\u0177_j) = -log(\u0177_c)\n\u5176\u4e2d c \u662f\u771f\u5b9e\u7c7b\u522b\n\n\u2202L/\u2202z = \u0177 - y\n\n\u4e3e\u4f8b\uff1a\u0177 = [0.2, 0.7, 0.1], y = [0, 1, 0]\n\u2202L/\u2202z = [0.2, -0.3, 0.1]</pre>"
                "<p>\u8fd9\u662f<a>\u3010\u6700\u7f8e\u7684\u516c\u5f0f\u4e4b\u4e00\u3011</a>\uff1a"
                "\u5206\u7c7b\u7f51\u7edc\u7684\u53cd\u5411\u4f20\u64ad\u68af\u5ea6\u7b80\u76f4\u5c31\u662f\u201c\u9884\u6d4b\u51cf\u771f\u5b9e\u201d\u3002</p>"
                "<p><b>\u6570\u503c\u7a33\u5b9a\u6027\u6280\u5de7\uff1a</b></p>"
                "<pre>\u4e0d\u7a33\u5b9a\u7248\uff1a    \u0177_i = e^{z_i} / \u2211 e^{z_j}\n\u7a33\u5b9a\u7248\uff08\u63a8\u8350\uff09\uff1a\u0177_i = e^{z_i - max(z)} / \u2211 e^{z_j - max(z)}</pre>"
                "<p>\u51cf\u53bb\u6700\u5927\u503c\u4e0d\u6539\u53d8\u7ed3\u679c\uff0c\u4f46\u9632\u6b62 e^{z_i} \u6ea2\u51fa\u3002</p>"
            )
        },
        {
            "type": "example",
            "title": "Softmax \u6570\u503c\u4f8b\u5b50",
            "content": (
                "<p>\u7ed9\u5b9a\u8f93\u5165\u5411\u91cf z = [1, 2, 3]\uff0c\u8ba1\u7b97 Softmax \u8f93\u51fa\u3002</p>"
                "<p><b>\u6b65\u9aa4 1\uff1a\u8ba1\u7b97\u6307\u6570</b></p>"
                "<pre>e^1 = 2.7183\ne^2 = 7.3891\ne^3 = 20.0855\n\n\u603b\u548c = 2.7183 + 7.3891 + 20.0855 = 30.1929</pre>"
                "<p><b>\u6b65\u9aa4 2\uff1a\u8ba1\u7b97\u6982\u7387</b></p>"
                "<pre>p_1 = 2.7183 / 30.1929 = 0.0900\np_2 = 7.3891 / 30.1929 = 0.2447\np_3 = 20.0855 / 30.1929 = 0.6652\n\n\u9a8c\u8bc1\uff1a0.0900 + 0.2447 + 0.6652 = 0.9999 \u2248 1.0 \u2713</pre>"
                "<p><b>\u6b65\u9aa4 3\uff1a\u6570\u503c\u7a33\u5b9a\u7248</b></p>"
                "<pre>max(z) = 3\nz' = [1-3, 2-3, 3-3] = [-2, -1, 0]\ne^{-2} = 0.1353\ne^{-1} = 0.3679\ne^{0} = 1.0000\n\n\u603b\u548c = 1.5033\np_1 = 0.1353/1.5033 = 0.0900\np_2 = 0.3679/1.5033 = 0.2447\np_3 = 1.0000/1.5033 = 0.6652 \u2713</pre>"
                "<p><b>\u5bf9\u6bd4\uff1a\u9884\u6d4b versus \u771f\u5b9e</b></p>"
                "<p>\u5982\u679c\u771f\u5b9e\u6807\u7b7e y = [0, 0, 1]\uff0c\u5219\uff1a</p>"
                "<pre>CrossEntropy = -[0\u00d7log(0.09) + 0\u00d7log(0.245) + 1\u00d7log(0.665)]\n             = -log(0.665) = 0.408</pre>"
                "<p>\u68af\u5ea6 dL/dz = \u0177 - y = [0.0900, 0.2447, 0.6652] - [0, 0, 1] = [0.0900, 0.2447, -0.3348]\u3002"
                "\u8fd9\u610f\u5473\u7740\u7b2c\u4e09\u4e2a\u7c7b\u522b\u7684\u8f93\u5165\u8981\u4e0b\u964d\uff0c\u524d\u4e24\u4e2a\u8981\u4e0a\u5347\u3002</p>"
            )
        },
        {
            "type": "exercise",
            "title": "Softmax \u7ec3\u4e60",
            "content": (
                "<p><b>Q1\uff1a</b>\u8ba1\u7b97\u8f93\u5165 z = [2, 1, 0] \u7684 Softmax \u8f93\u51fa\u3002</p>"
                "<p><b>Q2\uff1a</b>\u5982\u679c\u771f\u5b9e\u6807\u7b7e y = [1, 0, 0]\uff0c"
                "\u9884\u6d4b \u0177 = Softmax(z) = [0.7, 0.2, 0.1]\uff0c"
                "\u8ba1\u7b97 Cross-Entropy Loss \u548c\u68af\u5ea6\u3002</p>"
                "<p><b>Q3\uff1a</b>\u4ec0\u4e48\u662f\u201c\u6570\u503c\u7a33\u5b9a\u6027\u201d\u95ee\u9898\uff1f"
                "\u4e3a\u4ec0\u4e48 Softmax \u9700\u8981\u51cf\u53bb\u6700\u5927\u503c\uff1f</p>"
                "<p><b>Q4\uff1a</b>\u6e29\u5ea6\u53c2\u6570 \u03c4 \u5bf9 Softmax \u6709\u4ec0\u4e48\u5f71\u54cd\uff1f"
                "\u8ba1\u7b97\u5f53 \u03c4 = 0.5, \u03c4 = 1, \u03c4 = 3 \u65f6\uff0c"
                "\u8f93\u5165 z = [1, 2, 3] \u7684 Softmax \u5206\u5e03\u3002</p>"
                "<p><b>Q5\uff1a</b>\u4e3a\u4ec0\u4e48 Softmax \u901a\u5e38\u548c Cross-Entropy \u4e00\u8d77\u4f7f\u7528\uff1f"
                "\u5f53 Softmax + CE \u7ec4\u5408\u65f6\uff0c\u53cd\u5411\u4f20\u64ad\u68af\u5ea6\u6709\u4ec0\u4e48\u7279\u6b8a\u6027\uff1f</p>"
            ),
            "answer": (
                "<p><b>A1\uff1a</b></p>"
                "<pre>e^2 = 7.3891, e^1 = 2.7183, e^0 = 1.0000\n\u603b\u548c = 11.1074\np_1 = 7.3891/11.1074 = 0.6652\np_2 = 2.7183/11.1074 = 0.2447\np_3 = 1.0000/11.1074 = 0.0900</pre>"
                "<p><b>A2\uff1a</b></p>"
                "<pre>Loss = -[1\u00d7log(0.7) + 0\u00d7log(0.2) + 0\u00d7log(0.1)] = -log(0.7) = 0.3567\n\u68af\u5ea6 dL/dz = \u0177 - y = [0.7, 0.2, 0.1] - [1, 0, 0] = [-0.3, 0.2, 0.1]</pre>"
                "<p><b>A3\uff1a</b></p>"
                "<p>\u5f53 z \u4e2d\u6709\u5f88\u5927\u7684\u503c\u65f6\uff08\u5982 z = [1000, 0, 0]\uff09\uff0c"
                "e^{1000} \u8d85\u51fa\u8ba1\u7b97\u673a\u6d6e\u70b9\u6570\u8868\u793a\u8303\u56f4\uff08\u6ea2\u51fa\uff09\u3002"
                "\u51cf\u53bb max(z) \u540e\uff0c\u6240\u6709\u6307\u6570\u7684\u5e42\u90fd\u2264 0\uff0c"
                "\u6700\u5927\u7684 e^0 = 1\uff0c\u4e0d\u4f1a\u6ea2\u51fa\u3002"
                "\u56e0\u4e3a\u5206\u5b50\u5206\u6bcd\u540c\u65f6\u4e58\u4ee5 e^{-max(z)}\uff0c\u7ed3\u679c\u4e0d\u53d8\u3002</p>"
                "<p><b>A4\uff1a</b></p>"
                "<table>"
                "<tr><th>\u03c4</th><th>z/\u03c4</th><th>Softmax</th><th>\u7279\u70b9</th></tr>"
                "<tr><td>0.5</td><td>[2, 4, 6]</td><td>[0.015, 0.117, 0.868]</td><td>\u5c16\u9510\uff0c\u51e0\u4e4e\u786c\u5206\u914d</td></tr>"
                "<tr><td>1</td><td>[1, 2, 3]</td><td>[0.090, 0.245, 0.665]</td><td>\u6b63\u5e38</td></tr>"
                "<tr><td>3</td><td>[0.333, 0.667, 1]</td><td>[0.248, 0.314, 0.438]</td><td>\u5e73\u5766\uff0c\u63a5\u8fd1\u5747\u5300</td></tr>"
                "</table>"
                "<p><b>A5\uff1a</b></p>"
                "<p>Softmax \u548c Cross-Entropy \u662f\u201c\u5929\u7136\u914d\u5bf9\u201d\uff0c"
                "\u56e0\u4e3a\u7ec4\u5408\u540e\u7684\u68af\u5ea6\u6781\u5176\u7b80\u5355\uff1adL/dz = \u0177 - y\uff08\u9884\u6d4b\u51cf\u771f\u5b9e\uff09\u3002"
                "\u8fd9\u610f\u5473\u7740\u53cd\u5411\u4f20\u64ad\u4e2d\u4e0d\u9700\u8981\u8ba1\u7b97\u590d\u6742\u7684\u96c5\u53ef\u6bd4\u77e9\u9635\uff0c"
                "\u53ea\u9700\u505a\u4e00\u4e2a\u51cf\u6cd5\u3002\u8fd9\u662f\u6570\u5b66\u5de7\u5408\uff0c\u4e5f\u662f\u4e3a\u4ec0\u4e48\u6240\u6709\u5206\u7c7b\u7f51\u7edc\u90fd\u7528\u8fd9\u4e2a\u7ec4\u5408\u3002</p>"
            )
        },

        # ============================================================
        # SECTION 7: SUMMARY
        # ============================================================
        {
            "type": "text",
            "title": "\u6fc0\u6d3b\u51fd\u6570\u5bf9\u6bd4\u603b\u7ed3",
            "content": (
                "<p><b>\u4e94\u5927\u6fc0\u6d3b\u51fd\u6570\u5bf9\u6bd4\u8868\uff1a</b></p>"
                "<table>"
                "<tr><th>\u6fc0\u6d3b\u51fd\u6570</th><th>\u516c\u5f0f</th><th>\u8f93\u51fa\u8303\u56f4</th><th>\u6700\u5927\u5bfc\u6570</th><th>\u96f6\u4e2d\u5fc3</th><th>\u68af\u5ea6\u6d88\u5931</th><th>\u5e38\u7528\u573a\u666f</th></tr>"
                "<tr><td>Sigmoid</td><td>1/(1+e^{-x})</td><td>(0, 1)</td><td>0.25</td><td>\u2718</td><td>\u4e25\u91cd</td><td>\u4e8c\u5206\u7c7b\u8f93\u51fa\u5c42</td></tr>"
                "<tr><td>Tanh</td><td>(e^x-e^{-x})/(e^x+e^{-x})</td><td>(-1, 1)</td><td>1.0</td><td>\u2714</td><td>\u4e25\u91cd</td><td>RNN/LSTM</td></tr>"
                "<tr><td>ReLU</td><td>max(0, x)</td><td>[0, \u221e)</td><td>1</td><td>\u2718</td><td>\u65e0</td><td>CNN/MLP\u9690\u85cf\u5c42</td></tr>"
                "<tr><td>GELU</td><td>x\u00d7\u03a6(x)</td><td>[-0.17, \u221e)</td><td>\u2248 1</td><td>\u8fd1\u4f3c</td><td>\u65e0</td><td>Transformer/LLM</td></tr>"
                "<tr><td>Softmax</td><td>e^{z_i}/\u2211e^{z_j}</td><td>(0,1), sum=1</td><td>\u2248 0.25</td><td>-</td><td>\u4e0d\u9002\u7528</td><td>\u5206\u7c7b\u8f93\u51fa\u5c42/\u6ce8\u610f\u529b</td></tr>"
                "</table>"
                "<p><b>\u9009\u578b\u6307\u5357\uff1a</b></p>"
                "<ul>"
                "<li><b>\u9690\u85cf\u5c42\uff1a</b>\u4f18\u5148 ReLU\uff08\u7b80\u5355\u5feb\u901f\uff09\uff0c\u5927\u6a21\u578b\u7528 GELU</li>"
                "<li><b>\u4e8c\u5206\u7c7b\u8f93\u51fa\uff1a</b>Sigmoid</li>"
                "<li><b>\u591a\u5206\u7c7b\u8f93\u51fa\uff1a</b>Softmax</li>"
                "<li><b>RNN \u9690\u85cf\uff1a</b>Tanh</li>"
                "<li><b>Transformer/LLM\uff1a</b>GELU\uff08\u6216 SwiGLU\uff09</li>"
                "<li><b>Dead ReLU \u95ee\u9898\u4e25\u91cd\uff1a</b>Leaky ReLU \u6216 ELU</li>"
                "</ul>"
                "<p><b>\u5173\u952e\u5fc3\u6cd5\uff1a</b></p>"
                "<ol>"
                "<li>\u6fc0\u6d3b\u51fd\u6570\u7684\u672c\u8d28\u662f\u5f15\u5165\u975e\u7ebf\u6027\u2014\u2014\u6ca1\u6709\u5b83\u4eec\uff0c\u795e\u7ecf\u7f51\u7edc\u53ea\u662f\u7ebf\u6027\u56de\u5f52</li>"
                "<li>ReLU \u89e3\u51b3\u4e86\u68af\u5ea6\u6d88\u5931\uff0c\u4f46\u5f15\u5165 Dead ReLU</li>"
                "<li>GELU \u7528\u5e73\u6ed1\u7684\u6b63\u6001\u7d2f\u79ef\u5206\u66ff\u4ee3\u786c\u622a\u65ad\uff0c\u6210\u4e3a LLM \u6807\u914d</li>"
                "<li>Softmax \u628a\u201c\u5206\u6570\u201d\u53d8\u6210\u201c\u6982\u7387\u201d\uff0c\u914d\u5957 CE \u68af\u5ea6 = \u9884\u6d4b - \u771f\u5b9e</li>"
                "<li>\u5728\u771f\u5b9e\u9879\u76ee\u4e2d\uff1a\u9690\u85cf\u5c42 ReLU/GELU\uff0c\u8f93\u51fa\u5c42 Sigmoid/Softmax</li>"
                "</ol>"
            )
        }
    ]
}

# Write the JSON file
with open(r'D:\LvyzWeb\platform\src\content\crashai-expanded\course-activation.json', 'w', encoding='utf-8') as f:
    json.dump(course, f, ensure_ascii=False, indent=2)

print("Done! Course file written successfully.")
print(f"Total sections: {len(course['sections'])}")
for s in course['sections']:
    print(f"  [{s['type']}] {s['title']}")
