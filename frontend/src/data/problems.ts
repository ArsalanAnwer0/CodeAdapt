import { Problem } from '../types'

export const PROBLEMS: Problem[] = [
  // ===== ARRAYS =====
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    topic: 'arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
    return [];
}`,
      python: `from typing import List

def two_sum(nums: List[int], target: int) -> List[int]:
    # Your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
      go: `func twoSum(nums []int, target int) []int {
    // Your code here
    return nil
}`,
      rust: `use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Your code here
        vec![]
    }
}`,
    },
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    topic: 'arrays',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Your code here — try Kadane's algorithm
}`,
      typescript: `function maxSubArray(nums: number[]): number {
    // Your code here
    return 0;
}`,
      python: `from typing import List

def max_sub_array(nums: List[int]) -> int:
    # Your code here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
        return 0;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Your code here
        return 0;
    }
};`,
      go: `func maxSubArray(nums []int) int {
    // Your code here
    return 0
}`,
      rust: `impl Solution {
    pub fn max_sub_array(nums: Vec<i32>) -> i32 {
        // Your code here
        0
    }
}`,
    },
  },
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    topic: 'arrays',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.\n\nThe product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
    // Hint: use prefix and suffix arrays
}`,
      typescript: `function productExceptSelf(nums: number[]): number[] {
    // Your code here
    return [];
}`,
      python: `from typing import List

def product_except_self(nums: List[int]) -> List[int]:
    # Your code here
    pass`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Your code here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Your code here
        return {};
    }
};`,
      go: `func productExceptSelf(nums []int) []int {
    // Your code here
    return nil
}`,
      rust: `impl Solution {
    pub fn product_except_self(nums: Vec<i32>) -> Vec<i32> {
        // Your code here
        vec![]
    }
}`,
    },
  },

  // ===== STRINGS =====
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'easy',
    topic: 'strings',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ASCII character.',
    ],
    starterCode: {
      javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Two-pointer approach
}`,
      typescript: `function reverseString(s: string[]): void {
    // Your code here
}`,
      python: `from typing import List

def reverse_string(s: List[str]) -> None:
    """
    Do not return anything, modify s in-place instead.
    """
    # Your code here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here
    }
};`,
      go: `func reverseString(s []byte) {
    // Your code here
}`,
      rust: `impl Solution {
    pub fn reverse_string(s: &mut Vec<char>) {
        // Your code here
    }
}`,
    },
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'easy',
    topic: 'strings',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
    // Your code here
}`,
      typescript: `function isAnagram(s: string, t: string): boolean {
    // Your code here
    return false;
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    # Your code here
    pass`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Your code here
        return false;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        // Your code here
        return false;
    }
};`,
      go: `func isAnagram(s string, t string) bool {
    // Your code here
    return false
}`,
      rust: `impl Solution {
    pub fn is_anagram(s: String, t: String) -> bool {
        // Your code here
        false
    }
}`,
    },
  },
  {
    id: 'longest-palindrome',
    title: 'Longest Palindromic Substring',
    difficulty: 'medium',
    topic: 'strings',
    description: `Given a string \`s\`, return the longest palindromic substring in \`s\`.\n\nA string is palindromic if it reads the same forward and backward.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.',
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
function longestPalindrome(s) {
    // Expand around center approach
}`,
      typescript: `function longestPalindrome(s: string): string {
    // Your code here
    return '';
}`,
      python: `def longest_palindrome(s: str) -> str:
    # Your code here
    pass`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        // Your code here
        return "";
    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        // Your code here
        return "";
    }
};`,
      go: `func longestPalindrome(s string) string {
    // Your code here
    return ""
}`,
      rust: `impl Solution {
    pub fn longest_palindrome(s: String) -> String {
        // Your code here
        String::new()
    }
}`,
    },
  },

  // ===== TREES =====
  {
    id: 'max-depth-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'easy',
    topic: 'trees',
    description: `Given the \`root\` of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
      { input: 'root = [1,null,2]', output: '2' },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-100 <= Node.val <= 100',
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxDepth(root) {
    // Your code here
}`,
      typescript: `class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

function maxDepth(root: TreeNode | null): number {
    // Your code here
    return 0;
}`,
      python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root: Optional[TreeNode]) -> int:
    # Your code here
    pass`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        // Your code here
        return 0;
    }
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Your code here
        return 0;
    }
};`,
      go: `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func maxDepth(root *TreeNode) int {
    // Your code here
    return 0
}`,
      rust: `use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl Solution {
    pub fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        // Your code here
        0
    }
}`,
    },
  },
  {
    id: 'inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'easy',
    topic: 'trees',
    description: `Given the \`root\` of a binary tree, return the inorder traversal of its nodes' values.\n\nInorder traversal visits nodes in Left → Root → Right order.`,
    examples: [
      { input: 'root = [1,null,2,3]', output: '[1,3,2]' },
      { input: 'root = []', output: '[]' },
      { input: 'root = [1]', output: '[1]' },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100',
    ],
    starterCode: {
      javascript: `/**
 * @param {TreeNode} root
 * @return {number[]}
 */
function inorderTraversal(root) {
    const result = [];
    // Your recursive or iterative solution here
    return result;
}`,
      typescript: `function inorderTraversal(root: TreeNode | null): number[] {
    const result: number[] = [];
    // Your code here
    return result;
}`,
      python: `from typing import Optional, List

def inorder_traversal(root: Optional[TreeNode]) -> List[int]:
    result = []
    # Your code here
    return result`,
      java: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        // Your code here
        return result;
    }
}`,
      cpp: `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        // Your code here
        return result;
    }
};`,
      go: `func inorderTraversal(root *TreeNode) []int {
    result := []int{}
    // Your code here
    return result
}`,
      rust: `impl Solution {
    pub fn inorder_traversal(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
        let mut result = vec![];
        // Your code here
        result
    }
}`,
    },
  },
  {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'medium',
    topic: 'trees',
    description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.`,
    examples: [
      { input: 'root = [2,1,3]', output: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The root node\'s value is 5 but its right child\'s value is 4.' },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
    starterCode: {
      javascript: `/**
 * @param {TreeNode} root
 * @return {boolean}
 */
function isValidBST(root) {
    // Use min/max bounds approach
}`,
      typescript: `function isValidBST(root: TreeNode | null): boolean {
    // Your code here
    return false;
}`,
      python: `def is_valid_bst(root: Optional[TreeNode]) -> bool:
    # Your code here
    pass`,
      java: `class Solution {
    public boolean isValidBST(TreeNode root) {
        // Your code here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        // Your code here
        return false;
    }
};`,
      go: `func isValidBST(root *TreeNode) bool {
    // Your code here
    return false
}`,
      rust: `impl Solution {
    pub fn is_valid_bst(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        // Your code here
        false
    }
}`,
    },
  },

  // ===== DYNAMIC PROGRAMMING =====
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    topic: 'dynamic-programming',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top. 1 step + 1 step | 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1+1+1 | 1+2 | 2+1' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
    // Classic DP — think Fibonacci
}`,
      typescript: `function climbStairs(n: number): number {
    // Your code here
    return 0;
}`,
      python: `def climb_stairs(n: int) -> int:
    # Your code here
    pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Your code here
        return 0;
    }
};`,
      go: `func climbStairs(n int) int {
    // Your code here
    return 0
}`,
      rust: `impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        // Your code here
        0
    }
}`,
    },
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'medium',
    topic: 'dynamic-programming',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,5,11], amount = 11', output: '1', explanation: 'Use one coin of value 11.' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
    // Bottom-up DP approach
}`,
      typescript: `function coinChange(coins: number[], amount: number): number {
    // Your code here
    return -1;
}`,
      python: `from typing import List

def coin_change(coins: List[int], amount: int) -> int:
    # Your code here
    pass`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Your code here
        return -1;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Your code here
        return -1;
    }
};`,
      go: `func coinChange(coins []int, amount int) int {
    // Your code here
    return -1
}`,
      rust: `impl Solution {
    pub fn coin_change(coins: Vec<i32>, amount: i32) -> i32 {
        // Your code here
        -1
    }
}`,
    },
  },

  // ===== LINKED LISTS =====
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    topic: 'linked-lists',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Iterative: prev, curr pointers
}`,
      typescript: `class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}

function reverseList(head: ListNode | null): ListNode | null {
    // Your code here
    return null;
}`,
      python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    # Your code here
    pass`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Your code here
        return null;
    }
}`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Your code here
        return nullptr;
    }
};`,
      go: `type ListNode struct {
    Val  int
    Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
    // Your code here
    return nil
}`,
      rust: `#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl Solution {
    pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        // Your code here
        None
    }
}`,
    },
  },
  {
    id: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    topic: 'linked-lists',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' },
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    starterCode: {
      javascript: `/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
    // Use a dummy head node approach
}`,
      typescript: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    // Your code here
    return null;
}`,
      python: `def merge_two_lists(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    # Your code here
    pass`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your code here
        return null;
    }
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Your code here
        return nullptr;
    }
};`,
      go: `func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    // Your code here
    return nil
}`,
      rust: `impl Solution {
    pub fn merge_two_lists(
        list1: Option<Box<ListNode>>,
        list2: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        // Your code here
        None
    }
}`,
    },
  },

  // ===== BINARY SEARCH =====
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    topic: 'binary-search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.\n\nYou must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    let left = 0, right = nums.length - 1;
    // Your binary search logic here
}`,
      typescript: `function search(nums: number[], target: number): number {
    // Your code here
    return -1;
}`,
      python: `from typing import List

def search(nums: List[int], target: int) -> int:
    # Your code here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here
        return -1;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Your code here
        return -1;
    }
};`,
      go: `func search(nums []int, target int) int {
    // Your code here
    return -1
}`,
      rust: `impl Solution {
    pub fn search(nums: Vec<i32>, target: i32) -> i32 {
        // Your code here
        -1
    }
}`,
    },
  },

  // ===== SORTING =====
  {
    id: 'sort-colors',
    title: 'Sort Colors',
    difficulty: 'medium',
    topic: 'sorting',
    description: `Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers \`0\`, \`1\`, and \`2\` to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library's sort function. Try using the Dutch National Flag algorithm.`,
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]' },
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 300',
      'nums[i] is either 0, 1, or 2.',
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function sortColors(nums) {
    // Dutch National Flag: use three pointers (lo, mid, hi)
}`,
      typescript: `function sortColors(nums: number[]): void {
    // Your code here
}`,
      python: `from typing import List

def sort_colors(nums: List[int]) -> None:
    """
    Do not return anything, modify nums in-place instead.
    """
    # Your code here
    pass`,
      java: `class Solution {
    public void sortColors(int[] nums) {
        // Your code here
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void sortColors(vector<int>& nums) {
        // Your code here
    }
};`,
      go: `func sortColors(nums []int) {
    // Your code here
}`,
      rust: `impl Solution {
    pub fn sort_colors(nums: &mut Vec<i32>) {
        // Your code here
    }
}`,
    },
  },

  // ===== STACKS & QUEUES =====
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    topic: 'stacks-queues',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([)]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\' .',
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    const stack = [];
    // Use a stack to track opening brackets
}`,
      typescript: `function isValid(s: string): boolean {
    const stack: string[] = [];
    // Your code here
    return false;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    # Your code here
    pass`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        // Your code here
        return false;
    }
}`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        // Your code here
        return false;
    }
};`,
      go: `func isValid(s string) bool {
    stack := []rune{}
    // Your code here
    return false
}`,
      rust: `impl Solution {
    pub fn is_valid(s: String) -> bool {
        let mut stack: Vec<char> = vec![];
        // Your code here
        false
    }
}`,
    },
  },

  // ===== GRAPHS =====
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'medium',
    topic: 'graphs',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.',
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    // DFS or BFS from each unvisited '1'
}`,
      typescript: `function numIslands(grid: string[][]): number {
    // Your code here
    return 0;
}`,
      python: `from typing import List

def num_islands(grid: List[List[str]]) -> int:
    # Your code here
    pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Your code here
        return 0;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Your code here
        return 0;
    }
};`,
      go: `func numIslands(grid [][]byte) int {
    // Your code here
    return 0
}`,
      rust: `impl Solution {
    pub fn num_islands(grid: Vec<Vec<char>>) -> i32 {
        // Your code here
        0
    }
}`,
    },
  },

  // ===== RECURSION =====
  {
    id: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'medium',
    topic: 'recursion',
    description: `Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.\n\nA combination is well-formed if every opening bracket has a corresponding closing bracket in the correct order.`,
    examples: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: 'n = 1', output: '["()"]' },
    ],
    constraints: ['1 <= n <= 8'],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
function generateParenthesis(n) {
    const result = [];
    // Use backtracking with open/close count
    return result;
}`,
      typescript: `function generateParenthesis(n: number): string[] {
    const result: string[] = [];
    // Your backtracking solution
    return result;
}`,
      python: `from typing import List

def generate_parenthesis(n: int) -> List[str]:
    result = []
    # Your backtracking solution
    return result`,
      java: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        // Your code here
        return result;
    }
}`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> result;
        // Your code here
        return result;
    }
};`,
      go: `func generateParenthesis(n int) []string {
    result := []string{}
    // Your code here
    return result
}`,
      rust: `impl Solution {
    pub fn generate_parenthesis(n: i32) -> Vec<String> {
        let mut result = vec![];
        // Your code here
        result
    }
}`,
    },
  },
]

export function getProblemsForConfig(
  topic: string,
  difficulty: string
): Problem[] {
  const filtered = PROBLEMS.filter(
    (p) => p.topic === topic && p.difficulty === difficulty
  )
  if (filtered.length === 0) {
    // Fallback: same difficulty, any topic
    const byDiff = PROBLEMS.filter((p) => p.difficulty === difficulty)
    if (byDiff.length > 0) return byDiff
    return PROBLEMS
  }
  return filtered
}

export function getRandomProblem(topic: string, difficulty: string): Problem {
  const problems = getProblemsForConfig(topic, difficulty)
  return problems[Math.floor(Math.random() * problems.length)]
}
